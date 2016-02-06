var media = require('./media-loader')
  , base64SoundAtlas = media.sounds.atlas[1]
  , audioCtx = require('./audio-context')

module.exports = {
  soundAtlasArrayBuffer: (function() { return base64ToArrayBuffer(base64SoundAtlas) })()
, soundAtlasAudioBuffer: function(cb) {
    // first call,      asynchronous
    // following calls, synchronous
    if(typeof this.__saAudioBuffer === "undefined") {
      audioCtx.decodeAudioData(this.soundAtlasArrayBuffer, function(decodedData) {
          this.__saAudioBuffer = decodedData
          cb(this.__saAudioBuffer)
      }.bind(this))
    }
    else{ return cb(this.__saAudioBuffer) }
  }
, play: function(relativeDelay, audioSpriteStartTime, audioSampleDuration, cb) {
    return this.soundAtlasAudioBuffer(function(audioBuffer) {
      var source = audioCtx.createBufferSource()
      source.buffer = audioBuffer //audioBuffer, not arrayBuffer
      source.connect(audioCtx.destination)

      var start = source.start
      // coerce relativeDelay into start time
      start = start.bind(source, audioCtx.currentTime + (relativeDelay || 0))
      // coerce audioSpriteStartTime into finite value
      start = start.bind(source, (audioSpriteStartTime || 0))
      // play whole file if audio duration is not supplied
      typeof audioSampleDuration === 'undefined'
      ? start.call(source)
      : start.call(source, audioSampleDuration)

      typeof cb === "function" && cb(source)
      return source
    }.bind(this))
  }
}

function base64ToArrayBuffer (buffer) {
  var binary = window.atob(buffer)
  var buffer = new ArrayBuffer(binary.length)
  var bytes = new Uint8Array(buffer)
  for (var i = 0; i < buffer.byteLength; i++) {
    bytes[i] = binary.charCodeAt(i) & 0xFF
  }
  return buffer
}
