stubAudioPiecesIfGlobalsUnavailable()

module.exports = (function() { return new AudioContext })()

function stubAudioPiecesIfGlobalsUnavailable() {
  if(typeof AudioContext === "undefined") {
    AudioContext = function() { }
    AudioContext.prototype = { isTestHelper: true }
  }
}
