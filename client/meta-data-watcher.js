var _ = require('lodash')

module.exports = MetaWatcher

function MetaWatcher(background) { this.background = background }
MetaWatcher.prototype = {
  update: function(core) {
    var meta = _.find(core.entities, { layer: 'meta' })
    if(meta && meta.background) { this.background.backgroundString = meta.background }
  }
}
