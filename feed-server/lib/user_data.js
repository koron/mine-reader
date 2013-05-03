// vim:set ts=8 sts=2 sw=2 tw=0:

module.exports.getInstance = getInstance;

var fs = require('fs');
var path = require('path');
var FileDB = require('./file_db.js');

function getInstance(dataDir)
{
  // check existence of user's directory.
  try {
    var stats = fs.statSync(dataDir);
  } catch (e) {
    return null;
  }
  if (!stats.isDirectory()) {
    return null;
  }
  // FIXME: check permission.
  return new UserData(dataDir);
}

function UserData(dataDir)
{
  this.dataDir = dataDir;
}

UserData.prototype.getUnreadsDB = function()
{
  return new FileDB(path.join(this.dataDir, 'unreads'));
}
