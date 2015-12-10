module.exports = function(text, maxWidth) {
  var strings = text.split('\n')
  return strings.map(function(str) {
    return splitStringWithoutNewline(str, maxWidth)
  }).join('\n')
}

function splitStringWithoutNewline(string, maxWidth) {
  var newText = ''
  var words = string.split(' ')
  var totalNewlines = 0
  for(var i = 0; i < words.length; i++) {
    var lastLine = (newText).split('\n').pop()
    var beginning = lastLine.length === 0

    // word fits on current line
    if((lastLine + words[i]).length < maxWidth) {
      newText += beginning ? '' : ' '
      newText += words[i]
    }
    // word would fit if it had its own line
    else if(words[i].length <= maxWidth) {
      newText += '\n'
      newText += words[i]
    }
    // word had no chance, break it up
    else {
      var full = lastLine.length === maxWidth || lastLine.length === maxWidth-1
      newText += (beginning || full) ? '' : ' '
      var charsLeft = maxWidth - (
        lastLine + (beginning ? '' : ' ')
      ).length
      var charsForRestOfLine = words[i].substring(0,charsLeft)
      newText += charsForRestOfLine
      var carryChars = words[i].substring(charsLeft)
      while(carryChars.length > 0){
        var toAdd = carryChars.substring(0, maxWidth)
        newText += '\n'
        newText += toAdd
        carryChars = carryChars.substring(maxWidth)
      }
    }
  }
  return newText
}
