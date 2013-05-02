// vim:set ts=8 sts=2 sw=2 tw=0:

module.exports = FeedServer;

var http = require('http');
var domain = require('domain');

function FeedServer(config)
{
  var httpServer = http.createServer(handleRequest2);
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

  function handleRequest(request, response)
  {
    // TODO:
    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end('Hello World');
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
}

FeedServer.prototype.start = function()
{
  this.httpServer.listen(this.config.port);
  console.log('FeedServer start on port %d', this.config.port);
}
