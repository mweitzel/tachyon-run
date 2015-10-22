var scenes = {
  'menu': require('./scene-menu')
, 'drift': require('./scene-drift')
, 'level-editor': require('./scene-level-editor')
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
        emptyArray(this.core.entities)
        new scenes[sceneName](this.core)
        this.core.play()
        callback && callback()
      }.bind(this)
      , 0
    )
  }
}


function emptyArray(arr) {
  while(arr.pop() || arr.length) {}
}
