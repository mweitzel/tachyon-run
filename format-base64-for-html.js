module.exports = function(extension, base64data) {
  // e.g. "data:image/png;base64,iVBORw0KGgo....."
  return [
    'data:', mediaTypes[extension], '/', extension, ';base64,', base64data
  ].join('')
}

var mediaTypes = {
  mp3: 'audio'
, ogg: 'application'
, png: 'image'
, jpg: 'image'
, jpeg: 'image'
}
