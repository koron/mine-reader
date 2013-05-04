// vim:set sts=2 sw=2 tw=0 et:

module.exports = FileDB;

var FileReader = require('./io/file_reader.js');
var fs = require('fs');

function FileDB(path)
{
  this.path = path;
}

FileDB.prototype.getReader = function()
{
  return new FileReader(this.path);
}

FileDB.prototype.remove = function(filter, callback)
{
  if (!callback) {
    callback = function(success){};
  }
  var currPath = this.path;
  var newPath = this.path + '.new';
  var oldPath = this.path + '.old';
  var writer = fs.createWriteStream(newPath, { mode: 0644 });
  writer.on('open', onWriterOpened);

  function onWriterOpened()
  {
    var reader = new FileReader(currPath);
    reader.on('line', onReaderLine);
    reader.on('end', onReaderEnded);
    reader.on('error', onReaderErrored);
  }

  function onReaderLined(line)
  {
    if (!filter(line)) {
      writer.write(line);
      writer.write('\n');
    }
  }

  function onReaderEnded()
  {
    writer.end(function() {
      swapFiles(currPath, newPath, oldPath, function(success) {
        endCallback(success);
      });
    });
  }

  function onReaderErrored()
  {
    writer.end(function() {
      endCallback(false);
    });
  }
}

function swapFiles(target, newPath, oldPath, callback)
{
  fs.unlink(oldPath, unlinkedOldPath);

  function unlinkedOldPath(err)
  {
    if (err && err.code !== 'ENOENT') {
      console.warn('failed to unlink %s: %s', oldPath, err);
      callback(false);
    } else {
      fs.rename(target, oldPath, renamedToOldPath);
    }
  }

  function renamedToOldPath(err)
  {
    if (err) {
      console.warn('swap failure: failed to rename %s to %s: %s',
          target, oldPath, err);
      callback(false);
    } else {
      fs.rename(newPath, target, renamedToTarget);
    }
  }

  function renamedToTarget(err)
  {
    if (err) {
      console.warn('reverting: failed to rename %s to %s: %s',
          newPath, target, err);
      fs.rename(oldPath, target, reverted);
    } else {
      callback(true);
    }
  }

  function reverted(err) {
    if (err) {
      console.error('revert failure: failed to rename %s to %s: %s',
          oldPath, target, err);
    }
    callback(false);
  }
}
