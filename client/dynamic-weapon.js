var _ = require('lodash')
  , materias = require('./materias')
  , beget = require('../beget')
  , spawnProjectile = require('./spawn-projectile')
  , follow = require('./follow')
  , weapons = require('./weapons')
  , vector = require('../vector')
  , toVector = require('./word-directions').toVector

module.exports = {
  create: function(playerMateriaXp, weaponName, materiaNamesConfiguredForThisItem, parent) {
    var mats = _.merge(beget(materias), _.mapValues(playerMateriaXp, function(v) { return {xp:v} }))
    mats = _.pick(mats, materiaNamesConfiguredForThisItem)
    return new BassWeapon(weaponName, mats, parent)
  }
, attackTypesFromMateria: attackTypesFromMateria
}

function BassWeapon(weaponName, materiasOnWeapon, parent) {
  this.weaponName = weaponName
  this.materias = materiasOnWeapon

  this.weaponAttrs = beget(weapons[weaponName])
  _.forEach(this.materias, function(materia) {
    this.weaponAttrs[materia.type+'Attack'] = (this.weaponAttrs[materia.type+'Attack'] || 0 )
    this.weaponAttrs[materia.type+'Attack'] = this.weaponAttrs[materia.type+'Attack'] + attackBuffFromMateria(materia)
  }.bind(this))

  this.parent = parent
  this.team = this.parent.team
  follow.call(this, this.parent)
}

function attackBuffFromMateria(materia) {
  return 0.1 * materia.xp
}

BassWeapon.prototype = {
  fire: function(core) {
    var dir = vector.normalize(toVector(this.parent.directionsOfIntent(core)))
    var normalDx = dir[0]
    var normalDy = dir[1]
    if(!this.canFire(core)) { return }
    this.lastShot = core.lastUpdate
    spawnProjectile(
      core
    , { team: this.team
      , x: this.x
      , y: this.y
      , encounterStats: this.generateAttackStats()
      , spriteName: this.weaponAttrs.projectileSprite
      , contrailSprite: this.weaponAttrs.contrailSprite
      , emitContrailPeriod: this.weaponAttrs.emitContrailPeriod
      , ignoreGravity: !this.weaponAttrs.followsGravity
      , dx: normalDx * this.weaponAttrs.velocity
      , dy: normalDy * this.weaponAttrs.velocity
      , lifeInMs: this.weaponAttrs.lifeInMs
      , damageTypes: attackTypesFromMateria(Object.keys(this.materias))
      }
    )
  }
, canFire: function(core) {
    this.lastShot = this.lastShot || 0
    return this.lastShot + this.weaponAttrs.firePeriod <= core.lastUpdate
  }
, generateAttackStats: function() {
    return this.weaponAttrs
  }
}

function attackTypesFromMateria(materiaNameList) {
  return _.without(
    _.map(
      materiaNameList
    , function(materiaName) { return materias[materiaName].type }
    )
  , 'summon'
  )
}

//encounterStats
