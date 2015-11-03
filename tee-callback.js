module.exports = function(spyArray, cb) {
  return function() {
    spyArray.push(cb.apply(this, arguments))
    return spyArray[spyArray.length-1]
  }
}
