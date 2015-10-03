var http = require('http')

var request = module.exports = function(opts, cb) {
      var options = merge({ host: '127.0.0.1' , port: 8000 }, opts)
      var newArgs = [options].concat(Array.prototype.slice.call(arguments, 1))
      return http.request.apply(http, newArgs).end()
    }

function merge(obj1, obj2) {
  for (var attrname in obj2) { obj1[attrname] = obj2[attrname] }
  return obj1
}
