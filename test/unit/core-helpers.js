var td = require('testdouble')

module.exports = {
  mockCanvasContext: function() {
    return { clearRect: td.create() }
  }
, mockWindow: function() {
    var w = td.create()
    w.document = td.create()
    w.document.addEventListener = td.create()
    w.requestAnimationFrame = function(cb) { setTimeout(cb, 0) }//td.create()
    return w
  }
}
