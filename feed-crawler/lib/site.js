// vim:set sts=2 sw=2 tw=0 et:

module.exports = Site;

function Site(url)
{
  this.url = url;
}

Site.prototype.fetch = function(callback)
{
  var items = [];
  console.log('url=%s', this.url);
  // TODO:
  if (callback) {
    callback(items);
  }
}
