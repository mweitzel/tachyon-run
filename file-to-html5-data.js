var fs = require('fs')
  , path = require('path')
  , encoding = 'base64'

module.exports = function(filename) {
  var content = fs.readFileSync(path.resolve(filename), { encoding: encoding })
  var extname = path.extname(filename).slice(1)
  var mediaType = mediaTypes[extname]

  // e.g. "data:image/png;base64,iVBORw0KGgo....."
  return ['data:', mediaType, '/', extname, ';', encoding, ',', content].join('')
}

var mediaTypes = {
  mp3: 'audio'
, ogg: 'application'
, png: 'image'
, jpg: 'image'
, jpeg: 'image'
}
