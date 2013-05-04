// vim:set sts=2 sw=2 tw=0 et:

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
      response.end(err);
    } catch (e) {
      console.error('Error handling error', e);
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
    // detemine user and check it.
    var user = userData.getInstance(path.join(usersDir, args[0]));
    if (!user) {
      response.writeHead(404);
      response.end('Not found (code:2)');
      return;
    } else if (!hasGrant(request, user)) {
      response.writeHead(404);
      response.end('Not found (code:3)');
      return;
    }
    // detemine request resource handler.
    var handler = determineHandler(args[1], determineMethod(request));
    if (!handler) {
      response.writeHead(404);
      response.end('Not found (code:4)');
      return;
    }
    // dispatch to handler.
    handler(request, response, user, query);
  }

  function hasGrant(request, user)
  {
    // TODO: check access grant for user.
    return true;
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
    var override = request.headers['x-http-method-override'];
    if (override) {
      method = override;
    }
    if (method === 'PATCH') {
      var subMethod = request.headers['x-patch-submethod'];
      if (subMethod) {
        return method + '_' + subMethod.toUpperCase();
      }
    }
    return request.method;
  }

  function respond(request, response, reader, filter)
  {
    // FIXME: support JSONP request.
    var context = {
      first: true,
      send_line: send_line_first,
    };

    response.writeHead(200, { 'Content-type': 'application/json' });
    response.write('[');

    // setup reader as source.
    if (filter) {
      reader.on('line', function(line) {
        if (filter(line)) {
          context.send_line(line);
        }
      });
    } else {
      reader.on('line', function(line) { context.send_line(line); });
    }
    reader.on('end', send_end);
    reader.on('error', function(err) {
      if (err.code !== 'ENOENT') {
        console.warn(err.stack);
      }
      send_end();
    });

    function send_line_first(line) {
      response.write('\n');
      response.write(line);
      context.send_line = send_line;
      context.first = false;
    }
    function send_line(line) {
      response.write(',\n');
      response.write(line);
    }
    function send_end() {
      response.end('\n]');
    }
  }

  // FIXME: remove this after implement all resource handlers.
  function handleDefault(request, response, user, query)
  {
    var name = handleDefault.caller.name;
    console.log('%s: user=%s query=%s', name, user, JSON.stringify(query));
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World: ' + name);
  }

  function filterUnreadGet(request, query)
  {
    var prefix = query['prefix'];
    if (!prefix) {
      return function(line) {
        return true;
      };
    }
    return function(line) {
      try {
        var row = JSON.parse(line);
        if (row['path'].substring(0, prefix.length) === prefix) {
          return true;
        }
      } catch (e) {
      }
      return false;
    };
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
    var reader = user.getUnreadsDB().getReader();
    var filter = filterUnreadGet(request, query);
    respond(request, response, reader, filter);
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
