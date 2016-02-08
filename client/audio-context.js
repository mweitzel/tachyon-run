stubAudioPiecesIfGlobalsUnavailable()

module.exports = (function() { return new AudioContext })()

function stubAudioPiecesIfGlobalsUnavailable() {
  if(typeof AudioContext === "undefined") {
    AudioContext = function() { }
    AudioContext.prototype = {
      isTestHelper: true
    , decodeAudioData: function() {}
    , createBufferSource: function() { return  }
    , currentTime: 0
    }
    function StubbedBufferSource() {}
    StubbedBufferSource.prototype = {
      buffer: []
    , connect: function(destination) {}
    , start: function() {}
    }
  }
}
