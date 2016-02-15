var http = require('http')
  , fetch = require('../fetch-env')
  , HOST=fetch('HOST')
  , PORT=fetch('PORT')

var request = module.exports = function(opts, cb) {
      var options = merge({ host: HOST , port: PORT }, opts)
      var newArgs = [options].concat(Array.prototype.slice.call(arguments, 1))
      return http.request.apply(http, newArgs)
    }

function merge(obj1, obj2) {
  for (var attrname in obj2) { obj1[attrname] = obj2[attrname] }
  return obj1
}
