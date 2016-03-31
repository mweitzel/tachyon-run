var drawRegion = require('./draw-region')

module.exports = function(context) {
  var scriptParts = this.script.split(' ')
    , scriptType = scriptParts[0]
    , name = scriptParts[1]
    , width = parseInt(scriptParts[2])
    , height = parseInt(scriptParts[3])

  drawRegion.call({
    bounds: function() {
      return [ this.x, this.y, width, height ]
    }.bind(this)
  }, context)
}
