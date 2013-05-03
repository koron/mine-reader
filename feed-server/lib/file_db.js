// vim:set ts=8 sts=2 sw=2 tw=0:

module.exports = FileDB;

var FileReader = require('./io/file_reader.js');

function FileDB(path)
{
  this.path = path;
}

FileDB.prototype.getReader = function()
{
  return new FileReader(this.path);
}
