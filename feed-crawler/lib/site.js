// vim:set sts=2 sw=2 tw=0 et:

module.exports = Site;

var http = require('http');
var util = require('util');
var FeedParser = require('feedparser');

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
    res.pipe(new FeedParser())
      .on('error', function(error) {
        // always handle errors
        console.log('on_error: %s', util.inspect(error));
      })
    .on('meta', function (meta) {
      // do something
      console.log('on_meta: %s', JSON.stringify(meta));
    })
    .on('article', function (article) {
      // do something else
      console.log('on_article: %s', article.title);
      //JSON.stringify(article));
    })
    .on('end', function () {
      // do the next thing
      console.log('on_end');
    });

    callback(items);
  }

  function on_error(err)
  {
    console.log('Got error: %s', err);
    callback([]);
  }
}
