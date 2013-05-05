// vim:set sts=2 sw=2 tw=0 et:

var Site = require('./lib/site.js');

var site = new Site('http://www.kaoriya.net/rss.xml');
site.fetch(function(items) {
  console.log(items.length);
});
