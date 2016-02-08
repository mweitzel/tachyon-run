var playFromAtlasLib = require('./play-audio-from-atlas')
  , playTimeToTime = playFromAtlasLib.play.bind(playFromAtlasLib)
  , media = require('./media-loader')
  , spriteList = JSON.parse(media.text.sounds[1])
  , map = spriteList.spritemap
  , beget = require('../beget')

var ns = module.exports = {
  play: function(sampleName, delay) {
    var trackData = this.trackData(sampleName)
    if(!trackData) { return console.log('no track data for "' + sampleName + '"') }
    return playTimeToTime(delay || 0, trackData.start, trackData.end - trackData.start)
  }
, trackData: function(sampleName) {
    var data = map[sampleName]
    if(!data) { return }
    return beget(data)
  }
}
