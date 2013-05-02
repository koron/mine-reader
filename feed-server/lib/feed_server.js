// vim:set ts=8 sts=2 sw=2 tw=0:

module.exports = FeedServer;

var http = require('http');
var domain = require('domain');
var url = require('url');

var PREFIX = '/feed/users/';

function FeedServer(config)
{
  var httpServer = http.createServer(handleRequest2);
  var resourceHandlers = {
    'subscriptions': handleSubscriptions,
    'categories': handleCategories,
    'feeds': handleFeeds,
    'unreads': handleUnreads,
    'favorites': handleFavorites,
  };

  this.config = config;
  this.httpServer = httpServer;

  function handleRequest2(request, response)
  {
    var d = request.domain = domain.create();
    d.add(request);
    d.add(response);
    d.on('error', function(err) {
      handleError(request, response);
    });
    d.run(function() {
      handleRequest(request, response);
    });
  }

  function handleError(request, response, err)
  {
    try {
      response.writeHead(500);
      response.end(err.stack);
    } catch (e) {
      consle.error('Error handling error', e);
      request.domain.dispose();
    }
  }

  function handleRequest(request, response)
  {
    // parse addressing.
    var parsed = url.parse(request.url, true);
    var pathname = parsed.pathname;
    var query = parsed.query;
    // filter unknown path.
    if (pathname.indexOf(PREFIX) != 0) {
      response.writeHead(404);
      response.end('Not found (code:0)');
      return;
    }
    // extract args (userId, handler) from pathname.
    var args = pathname.split('/').slice(3);
    if (args.length < 2) {
      response.writeHead(404);
      response.end('Not found (code:1)');
      return;
    }
    var userId = args[0];
    var handler = resourceHandlers[args[1]];
    if (!handler) {
      response.writeHead(404);
      response.end('Not found (code:2)');
      return;
    }
    handler(request, response, userId, query);
  }

  function handleSubscriptions(request, response, user, query)
  {
    // TODO:
    console.log('user=%s query=%s', user, JSON.stringify(query));
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World: handleSubscriptions');
  }

  function handleCategories(request, response, user, query)
  {
    // TODO:
    console.log('user=%s query=%s', user, JSON.stringify(query));
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World: handleCategories');
  }

  function handleFeeds(request, response, user, query)
  {
    // TODO:
    console.log('user=%s query=%s', user, JSON.stringify(query));
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World: handleFeeds');
  }

  function handleUnreads(request, response, user, query)
  {
    // TODO:
    console.log('user=%s query=%s', user, JSON.stringify(query));
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World: handleUnreads');
  }

  function handleFavorites(request, response, user, query)
  {
    // TODO:
    console.log('user=%s query=%s', user, JSON.stringify(query));
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World: handleFavorites');
  }
}

FeedServer.prototype.start = function()
{
  this.httpServer.listen(this.config.port);
  console.log('FeedServer start on port %d', this.config.port);
}
