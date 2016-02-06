var fs = require('fs')

module.exports = {
  sounds: {
    thunk: [ 'mp3', fs.readFileSync('test/media/thunk.mp3', 'base64') ]
  , atlas: [ 'ogg', fs.readFileSync('media/sound-atlas.ogg', 'base64') ]
  }
, images: {
    atlas: [ 'png', fs.readFileSync('media/atlas-1.png', 'base64') ]
  , fontAtlas: [ 'png', fs.readFileSync('media/font/font-atlas.png', 'base64') ]
  }
, text: {
    atlas: [ 'json', fs.readFileSync('media/atlas-1.json', 'ascii') ]
  , sprite: [ 'json', fs.readFileSync('media/sprite-meta.json', 'ascii') ]
  , sounds: [ 'json', fs.readFileSync('media/sound-atlas.json', 'ascii') ]
  }
}
