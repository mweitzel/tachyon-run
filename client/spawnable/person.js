var _ = require('lodash')
  , PE = require('../playable-entity')
  , beget = require('../../beget')
  , sprites = require('../all-sprites')
  , zIndex = require('../layer-z-defaults').tangible
  , UseRegion = require('../use-region')
  , engageInDialogue = require('../engage-in-dialogue')

module.exports = Person

function Person(x, y, name) {
  this.team = 'neutral'
  this.x = x
  this.y = y
  this.name = name
  this.currentAction = defaultsActionFor(name)
  this.sprite = sprites.get(this.currentIdentifier())
  this.__defineGetter__('spriteX', function() { return this.x - this.sprite.width/2 })
  this.__defineGetter__('spriteY', function() { return this.y - this.sprite.height })
}

Person.prototype = _.merge(
  beget(PE.prototype)
, {
    bounds: function() { return [ this.x - 4, this.y - 24, 8, 24 ] }
  , getUseRegions: function() {
      return [
        { bounds: function() { return [this.x-32, this.y-5, 32, 5] }.bind(this) }
      , { bounds: function() { return [this.x   , this.y-5, 32, 5] }.bind(this) }
      ]
    }
  }
, {
    z: zIndex
  , currentIdentifier: function() {
      return [this.name, this.currentAction].join('_')
    }
  , interact: function(user, core) {
//      engageInDialogue(core, ['hello fuckers'], this, user)
//      engageInDialogue(core, ['hey fucker', 'what the hell is going on?!'], this, user)
//      engageInDialogue(core, require('../dialogues').dialogues.azalea.intro_on_teleport, this, user)
      engageInDialogue(core, require('../dialogues').dialogues.azalea.intro_pester, this, user)
    }
  }
, {
    initialize: function(core) {
      if(this.__initialized) { return }
      this.__initialized = true
      this.getUseRegions().forEach(function(regionObj) {
        var useRegion = new UseRegion(this, regionObj.bounds, this.interact.bind(this))
        core.entities.push(useRegion)
      }.bind(this))
    }
  , update: function(core) {
      this.initialize(core)
    }
  }
)

function defaultsActionFor(name) {
  return ({
    azalea: 'sit_back'
  })[name] || 'stand'
}
