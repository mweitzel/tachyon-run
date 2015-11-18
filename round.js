module.exports = Round

function Round(array) {
  this.array = array
}

Round.prototype = {
  set index(index) {
    var i = this.__index
    this.__index = index + this.array.length
    this.__index = this.array.length === 0 ? 0 : this.__index % this.array.length
  }
, set array(array) {
    this.__array = array || []
    this.index = this.index || 0
  }
, get array() {
    return this.__array
  }
, get index() { return this.__index }
, get current() { return this.array[this.index] }
, next: function() { this.index++ ; return this.current }
, previous: function() { this.index-- ; return this.current }
, toArray: function() {
    return this.array.slice(0,this.index).concat(this.array.slice(this.index, this.length))
  }
, removeCurrent: function() {
    var c = this.current
    this.array = this.array.slice(0,this.index).concat(this.array.slice(this.index+1, this.length))
    if(this.__index === this.array.length) { this.previous() }
    console.log(this.array, this.length)
    return c
  }
}
