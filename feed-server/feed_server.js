var FeedServer = require('./lib/feed_server.js');
var server = new FeedServer({
  port: 8080,
  users_dir: 'tmp/var',
});
server.start();
