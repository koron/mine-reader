// vim:set ts=8 sts=2 sw=2 tw=0:

module.exports = FeedServer;

var http = require('http');
var domain = require('domain');
var url = require('url');
var fs = require('node-fs');
var userData = require('./user_data.js');
var path = require('path');

var PREFIX = '/feed/users/';

function FeedServer(config)
{
  var httpServer = http.createServer(handleRequest2);
  var usersDir = config.users_dir;
  var resourceHandlers = {
    'subscriptions': {
      'GET': handleSubscriptionsGet,
      'PATCH_ADD': handleSubscriptionsPatchAdd,
      'PATCH_REPLACE': handleSubscriptionsPatchReplace,
      'PATCH_REMOVE': handleSubscriptionsPatchRemove,
    },
    'categories': {
      'GET': handleCategoriesGet,
      'PATCH_ADD': handleCategoriesPatchAdd,
      'PATCH_REPLACE': handleCategoriesPatchReplace,
      'PATCH_REMOVE': handleCategoriesPatchRemove,
    },
    'feeds': {
      'GET': handleFeedsGet,
    },
    'unreads': {
      'GET': handleUnreadsGet,
      'PATCH_ADD': handleUnreadsPatchAdd,
      'PATCH_REMOVE': handleUnreadsPatchRemove,
    },
    'favorites': {
      'GET': handleFavoritesGet,
      'PATCH_ADD': handleFavoritesPatchAdd,
      'PATCH_REMOVE': handleFavoritesPatchRemove,
    }
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
    // extract args from pathname.
    var args = pathname.split('/').slice(3);
    if (args.length < 2) {
      response.writeHead(404);
      response.end('Not found (code:1)');
      return;
    }
    // TODO: detemine user and check.
    var user = userData.getInstance(path.join(usersDir, args[0]));
    if (!user) {
      response.writeHead(404);
      response.end('Not found (code:2)');
      return;
    }
    // detemine request resource handler.
    var handler = determineHandler(args[1], determineMethod(request));
    if (!handler) {
      response.writeHead(404);
      response.end('Not found (code:3)');
      return;
    }
    // dispatch to handler.
    handler(request, response, user, query);
  }

  function determineHandler(resource, method)
  {
    var methodHandlers = resourceHandlers[resource];
    if (!methodHandlers) {
      return null;
    }
    return methodHandlers[method];
  }

  function determineMethod(request)
  {
    var method = request.method;
    if (method === 'PATCH') {
      var subMethod = request.headers['x-patch-submethod'];
      if (subMethod) {
        return method + '_' + subMethod.toUpperCase();
      }
    }
    return request.method;
  }

  // FIXME: remove this after implement all resource handlers.
  function handleDefault(request, response, user, query)
  {
    var name = handleDefault.caller.name;
    console.log('%s: user=%s query=%s', name, user, JSON.stringify(query));
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World: ' + name);
  }

  function handleSubscriptionsGet(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleSubscriptionsPatchAdd(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleSubscriptionsPatchReplace(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleSubscriptionsPatchRemove(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleCategoriesGet(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleCategoriesPatchAdd(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleCategoriesPatchReplace(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleCategoriesPatchRemove(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleFeedsGet(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleUnreadsGet(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleUnreadsPatchAdd(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleUnreadsPatchRemove(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleFavoritesGet(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleFavoritesPatchAdd(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }

  function handleFavoritesPatchRemove(request, response, user, query)
  {
    // TODO:
    handleDefault(request, response, user, query);
  }
}

FeedServer.prototype.start = function()
{
  // create users dir, when not exists.
  fs.mkdirSync(this.config.users_dir, 0755, true);
  // start HTTP server.
  this.httpServer.listen(this.config.port);
  console.log('FeedServer start on port %d', this.config.port);
}
