var _ = require('lodash')
  , types = [
      'fire'
    , 'ice'
    , 'water'
    , 'gravity'
    ]

module.exports = receiveDamageFrom

function receiveDamageFrom(other) {
  var damage = calculate(other.encounterStats || {}, this.encounterStats || {})
  this.applyDamage && this.applyDamage(damage)
  other.dealtDamage && other.dealtDamage(damage)
}

receiveDamageFrom.calculate = calculate

function calculate(from, to) {
  var attackTypes = _.filter(types, function(type) {
    return !!from[type+'Attack']
  })
  var multiplier = attackTypes.reduce(function(carry, type) {
    var buff =   1 + (from[type+'Attack'] || 0)
    var resist = 1 -   (to[type+'Resist'] || 0)
    return carry * buff * resist
  }, 1)
  return multiplier * (from.baseDamage || 1)
}
