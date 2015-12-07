var allSprites = require('./all-sprites')
  , Saver = require('./level-editor-serialize')
  , saver = new Saver(allSprites)
  , serialzedLevelData = require('./level-data')
  , convertParsedToPlayable = require('./convert-parsed-level-data-to-playable')

module.exports = function(levelDataKey) {
  return convertParsedToPlayable(
    saver.parse(
      serialzedLevelData[levelDataKey]
    )
  )
}
