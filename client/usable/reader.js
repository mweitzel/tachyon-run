var textReader = require('../text-reader')
  , readers = require('../dialogues').readers

module.exports = function(readerTextName, user, core) {
  new textReader(core, readers[readerTextName])
}
