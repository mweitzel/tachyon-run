var fs = require('fs')
  , path = require('path')
  , build = require('./build-assets')

module.exports = function*(page, next) {
  return yield serveFile.call(this, 'public/assets', page, next)
}

function *serveFile(dir, file, next) {
  var assetSource = path.resolve(dir, file)
  if(!fs.existsSync(assetSource)) { return yield next }
  this.type = contentTypes[path.extname(assetSource)]
  this.body = build(assetSource)

}

var contentTypes = {
  '.js': 'application/javascript'
}
