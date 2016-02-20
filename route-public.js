var fs = require('fs')
  , path = require('path')
  , build = require('./build-assets')
  , assetSourceDir = 'public/assets'

module.exports = serveFile

function *serveFile(page, next) {
  var assetSource = getAssetSource(page)
  if(!fs.existsSync(assetSource)) { return yield next }
  this.type = contentTypes[path.extname(page)]
  this.body = build(assetSource)
}

function getAssetSource(pageName) {
  var nameParts = path.parse(pageName)
  console.log(pageName)
  nameParts.base = nameParts.name + (sourceExtensions[nameParts.ext] || nameParts.ext)
  return path.resolve(assetSourceDir, path.format(nameParts))
}

var sourceExtensions = {
  '.css': '.scss'
, '': ''
}

var contentTypes = {
  '.js': 'application/javascript'
, '.css': 'text/css'
, '.png': 'image/png'
, '.ico': 'image/x-icon'
, '.gif': 'image/gif'
}
