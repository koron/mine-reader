// vim:set sts=2 sw=2 tw=0 et:

module.exports = Site;

var http = require('http');

function Site(url)
{
  this.url = url;
}

Site.prototype.fetch = function(callback)
{
  var url = this.url;

  if (!callback) {
    callback = function(items) {};
  }
  http.get(this.url, on_response).on('error', on_error);

  function on_response(res)
  {
    var items = [];
    console.log('Got response %d from %s', res.statusCode, url);
    // TODO:
    callback(items);
  }

  function on_error(err)
  {
    console.log('Got error: %s', err);
    callback([]);
  }
}
