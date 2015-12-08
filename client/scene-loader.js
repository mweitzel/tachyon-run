var maxTileSize = 32
  , TileMap = require('./tile-map')
var scenes = {
  'menu': require('./scene/menu')
, 'level-editor': require('./scene/level-editor')
, 'blank': require('./scene/blank')
}

module.exports = Loader

function Loader(core) {
  this.core = core
}

Loader.prototype = {
  load: function(sceneName, callback) {
    this.core.pause()
    this.core.entities.forEach(function(gameObject) {
      gameObject.destroy && gameObject.destroy()
    })
    setTimeout( // don't mutate array while core is iterating over it
      function(){
        this.__prepCoreForNewScene()
        var scene = new scenes[sceneName](this.core)
        callback && callback.call(scene, this.core)
        this.core.play()
      }.bind(this)
      , 0
    )
  }
, __prepCoreForNewScene: function() {
    emptyArray(this.core.entities)
    this.core.cameraCenter = { x: 0, y: 0 } // god knows what happens to this object
    this.core.tileMap = new TileMap(maxTileSize)
    this.core.beforeUpdate = function(core) {
      for(var i = 0; i < core.entities.length; i++) {
        var ent = core.entities[i]
        if(typeof ent.bounds === 'function' && !ent.__cachedTileKeys)
          core.tileMap.cache(ent)
      }
    }
  }
}


function emptyArray(arr) {
  while(arr.pop() || arr.length) {}
}
