module.exports = {
  toVector: function(words, normalize) {
    return words.reduce(function(vector, direction) {
      if(direction == 'left')  { vector[0]-- }
      if(direction == 'right') { vector[0]++ }
      if(direction == 'up')    { vector[1]-- }
      if(direction == 'down')  { vector[1]++ }
      return vector
    }, [0,0])
  }
}
