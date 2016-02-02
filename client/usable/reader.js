var textReader = require('../text-reader')

module.exports = function(readerTextName, user, core) {
  new textReader(core, readerTextName)
}
