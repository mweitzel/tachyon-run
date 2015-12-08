var allSprites = require('./all-sprites')
  , Saver = require('./level-editor-serialize')
  , saver = new Saver(allSprites)
  , serialzedLevelData = require('./level-data')
  , converter = require('./convert-parsed-level-data-to-playable')
  , convertParsedToPlayable = converter.bind(converter, convertSerializedToGameObject)

module.exports = convertSerializedToGameObject

function convertSerializedToGameObject(levelDataKey) {
  return convertParsedToPlayable(
    saver.parse(
      serialzedLevelData[levelDataKey]
    )
  )
}
