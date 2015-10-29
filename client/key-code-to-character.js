var _ = require('lodash')
  , keys = require('./keys')

module.exports = function(capitalize, keyCode) {
  var char = _.findKey(keys , function(value) { return value == keyCode } )
  char = char === 'SPACE' ? ' ' : char
  if(typeof char !== 'string' || ( char.length !== 1 )) { return '' }
  return capitalize ? keyShift(char) : char.toLowerCase()
}

var capitalizedKeyMap = {
    1: '!'
  , 2: '@'
  , 3: '#'
  , 4: '$'
  , 5: '%'
  , 6: '^'
  , 7: '&'
  , 8: '*'
  , 9: '('
  , 0: ')'
  , "'": '"'
  ,"\\": '|'
  , '-': '_'
  , '=': '+'
  , '[': '{'
  , ']': '}'
  , ';': ':'
  , ',': '<'
  , '.': '>'
  , '/': '?'
  , '`': '~'
}

function keyShift(char) {
  return capitalizedKeyMap[char] || char.toUpperCase()
}
