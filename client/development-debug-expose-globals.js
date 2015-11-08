module.exports = {
  exposeCore: function(core) {
    Core = core
  }
, exposeLodash: function() {
    _ = require('lodash')
  }
}
