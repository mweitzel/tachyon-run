module.exports = {
  normalize: function(vector) {
    var l = this.length(vector)
    return vector.map(function(p) { return p/l })
  }
, length: function(vector) {
    return Math.sqrt(
      vector.reduce(function(prev, current){
        return prev + (current*current)
      }, 0)
    )
  }
}
