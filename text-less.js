
module.exports = textLess

function textLess(text, maxLines, furthestChar) {
  console.log(maxLines, text.split('\n').length)
  maxLines = maxLines || text.split('\n').length
  furthestChar = furthestChar || 0
  var textUntilFurthestChar = text.substring(0, furthestChar)
  var displayLines = textUntilFurthestChar.split('\n')
  var displayText = displayLines
    .slice(-maxLines, displayLines.length)
    .join('\n')
  return {
    text: displayText
  , proceed: textLess.bind(null, text, maxLines, furthestChar+1)
  , done: furthestChar >= text.length
  }
}
