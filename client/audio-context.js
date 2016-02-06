stubAudioPiecesIfGlobalsUnavailable()

module.exports = (function() { return new AudioContext })()

function stubAudioPiecesIfGlobalsUnavailable() {
  if(typeof Audio === "undefined") {
    AudioContext = function() { }
    AudioContext.prototype = { isTestHelper: true }
  }
}
