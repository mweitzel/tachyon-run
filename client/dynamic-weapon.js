var _ = require('lodash')
  , materias = require('./materias')
  , beget = require('../beget')
  , spawnProjectile = require('./spawn-projectile')
  , follow = require('./follow')
  , weapons = require('./weapons')

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
  var m = this.materias = materiasOnWeapon

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
    spawnProjectile(
      core
    , { team: this.team
      , x: this.x
      , y: this.y
      , encounterStats: this.generateAttackStats()
      , spriteName: this.weaponAttrs.projectileSprite
      , contrailSprite: this.weaponAttrs.contrailSprite
      , emitContrailPeriod: this.weaponAttrs.emitContrailPeriod
      }
    )
  }
, generateAttackStats: function() {
    return this.weaponAttrs
  }
}

function attackTypesFromMateria(materiaList) {
  return _.without(
    _.map(
      materiaList
    , function(materiaName) { return materias[materiaName].type }
    )
  , 'summon'
  )
}

//encounterStats
