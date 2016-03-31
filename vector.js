module.exports = {
  normalize: function(vector) {
    var l = this.length(vector)
    return vector.map(function(p) { return p/l || 0 })
  }
, length: function(vector) {
    return Math.sqrt(
      vector.reduce(function(prev, current){
        return prev + (current*current)
      }, 0)
    )
  }
, degreeToRadian: function(degrees) { return degrees * Math.PI / 180 }
, radianToDegree: function(radian) { return radian * 180 / Math.PI }
, fromRadian: function(radian) {
    return [Math.cos(radian), Math.sin(radian)]
  }
, fromDegree: function(degrees) { return this.fromRadian(this.degreeToRadian(degrees)) }
}
