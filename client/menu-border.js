var allSprites = require('./all-sprites')
  , draw = require('./sprite').draw
  , borderSize = require('./config').menuBorderSize

module.exports = function(type, bounds) {
  return {
    draw: function(ctx) {
      obj(circuit.topLeft,  bounds[0]                     , bounds[1]).draw(ctx)
      obj(circuit.topRight, bounds[0]+bounds[2]-borderSize, bounds[1]).draw(ctx)
      obj(circuit.botLeft,  bounds[0]                     , bounds[1]+bounds[3]-borderSize).draw(ctx)
      obj(circuit.botRight, bounds[0]+bounds[2]-borderSize, bounds[1]+bounds[3]-borderSize).draw(ctx)
      for(var x = borderSize; x < bounds[2]-borderSize; x += borderSize) {
        obj(circuit.top, bounds[0]+x, bounds[1]).draw(ctx)
        obj(circuit.bot, bounds[0]+x, bounds[1]+bounds[3]-borderSize).draw(ctx)
      }
      for(var y = borderSize; y < bounds[3]-borderSize; y += borderSize) {
        obj(circuit.left,  bounds[0]                     , bounds[1]+y).draw(ctx)
        obj(circuit.right, bounds[0]+bounds[2]-borderSize, bounds[1]+y).draw(ctx)
      }
    }
  }
}

function obj(sprite, x, y) {
  return { sprite: sprite, x: x, y: y, draw: draw }
}

var circuit = {
  topLeft: allSprites.get('menu_circuit_corner_top_left')
, botLeft: allSprites.get('menu_circuit_corner_bot_left')
, topRight: allSprites.get('menu_circuit_corner_top_left').enmirror()
, botRight: allSprites.get('menu_circuit_corner_bot_left').enmirror()
, left: allSprites.get('menu_circuit_left')
, right: allSprites.get('menu_circuit_left').enmirror()
, top: allSprites.get('menu_circuit_top')
, bot: allSprites.get('menu_circuit_bot')
}
