module.exports = function(other) {
  return this.collidable
  && other.collidable
  && ( other.layer == 'ground'
    || ( this.team !== other.team )
    )
  && collidesWith.call(this, other)
}
