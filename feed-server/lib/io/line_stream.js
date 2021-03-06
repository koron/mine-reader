// vim:set ts=8 sts=2 sw=2 tw=0:

// Class LineStream:
//  Event: 'line' (linedata)
//  Event: 'end'
//  Event: 'End' (error)

module.exports = LineStream

var EE = require('events').EventEmitter;
var util = require('util');

util.inherits(LineStream, EE);

function LineStream()
{
  EE.call(this);
}

LineStream.prototype.emit_later = function()
{
  var thiz = this;
  var args = arguments;
  process.nextTick(function() { thiz.emit.apply(thiz, args); });
}

LineStream.prototype.emit_line = function(line)
{
  this.emit_later('line', line);
}

LineStream.prototype.emit_end = function()
{
  this.emit_later('end');
}

LineStream.prototype.emit_error = function(err)
{
  this.emit_later('error', err);
}
