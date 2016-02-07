var td = require('testdouble')
  , props = require('../../canvas-properties')

module.exports = {
  mockCanvasContext: function() {
    return {
      clearRect: td.create()
    , setTransform: td.create()
    , width: props.width
    , height: props.height
    }
  }
, mockWindow: function() {
    var w = td.create()
    w.document = td.create()
    w.document.addEventListener = td.create()
    w.addEventListener = td.create()
    w.requestAnimationFrame = function(cb) { setTimeout(cb, 0) }//td.create()
    return w
  }
}
