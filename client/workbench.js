var allSprites = require('./all-sprites')
  , draw = require('./sprite').draw
  , keys = require('./keys')
  , pad = require('./inner-pad')
  , colors = require('./colors')
  , config = require('./config')
  , floatWithin = require('./float-within')
  , subRegion = require('./sub-region')
  , menuBorder = require('./menu-border').bind(null, 'circuit')
  , Round = require('../round')
  , Rstring = require('./renderable-string')
  , _ = require('lodash')

module.exports = Workbench

function Workbench(core, player) {
  core.priorityStack.push(this)
  this.exit = core.removePriorityObj.bind(core, this)

  this.player = player
  this.materias = new Round(player.computeUnusedMaterias())

  this.setActiveWeapon()
  this.rstring = new Rstring('')
  this.rstring.backgroundColor = colors.transparent

  this.panels = new Round([
    this.renderCurrentWeaponMateria
  , this.materias
  ])
  this.panels.current.active = true
}

Workbench.prototype = {
  draw: function(ctx) {
    ctx.fillStyle = colors.menuModelBackgroundFade
    ctx.fillRect.apply(ctx, [0,0,ctx.width,ctx.height])
    ctx.fillRect.apply(ctx, paddedFullRegion(ctx))
    ctx.fillRect.apply(ctx, paddedFullRegion(ctx))
    menuBorder(paddedFullRegion(ctx))
    .draw(ctx)
    arrangeActiveWeapon(xywhObjHoldingSprite(this.activeSprite), ctx)
    .draw(ctx)
    arrangeMateriaPreviewText(this.rstring, ctx)
    .draw(ctx)

    this.drawMateriaList(this.materias, [0.5,0,0.5,1], this.isActivePanel(this.materias), ctx)
    this.drawMateriaList(this.renderCurrentWeaponMateria, [0,0,0.5,1], this.isActivePanel(this.renderCurrentWeaponMateria), ctx)
  }
, isActivePanel: function(supposedlyPanel) {
    return this.panels.current === supposedlyPanel
  }
, drawMateriaList: function(materiaList, subRegionBounds, showSelected, ctx) {
    var materiaDrawRegion = padMenuBorder(subRegion(paddedFullRegion(ctx), subRegionBounds))
    for(var i = 0; i < materiaList.array.length; i++) {
      var materia = materiaList.array[i]
      draw.call(
        { sprite: allSprites.get(materia.split('_')[0])
        , x: materiaDrawRegion[0]
        , y: materiaDrawRegion[1] + i*config.tileSize
        }
      , ctx)
      if(showSelected && i === materiaList.index ) {
        draw.call(
          { sprite: allSprites.get('selected')
          , x: materiaDrawRegion[0]
          , y: materiaDrawRegion[1] + i*config.tileSize
          }
        , ctx)
      }
    }
    if(showSelected && materiaList.array.length === 0 ) {
        draw.call(
          { sprite: allSprites.get('selected')
          , x: materiaDrawRegion[0]
          , y: materiaDrawRegion[1] + i*config.tileSize
          }
        , ctx)
    }
  }
, update: function(core) {
    if(
      (core.input.getKey(keys.CTRL) && core.input.getKeyDown(keys.C))
    || core.input.getKeyDown(keys.ESCAPE)
    ) {
      return this.exit()
    }
    if(core.input.getKeyDown(keys.UP)){
      this.panels.current.previous()
    }
    if(core.input.getKeyDown(keys.DOWN)){
      this.panels.current.next()
    }
    if(core.input.getKeyDown(keys.RIGHT)){
      this.panels.next()
    }
    if(core.input.getKeyDown(keys.LEFT)){
      this.panels.previous()
    }
    if(core.input.getKeyDown(keys.SPACE)){
      if(this.panels.current === this.materias)
        this.tryToPutMateriaOnItem()
      else
        this.tryToRemoveMateriaFromItem()
    }
    this.rstring.string = this.panels.current.current || '--'
  }
, tryToPutMateriaOnItem() {
    if(!this.currentWeaponHasOpenMateriaSlots()) { return }
    if(!this.materias.current) { return }
    this.player.weapons[this.currentWeapon].materia.push(this.materias.current)
    this.renderCurrentWeaponMateria.array = this.player.weapons[this.currentWeapon].materia
    this.materias.array = this.player.computeUnusedMaterias()
  }
, currentWeaponHasOpenMateriaSlots() {
    var actualWeapon = this.player.weapons[this.currentWeapon]
    return actualWeapon.materia.length < actualWeapon.materiaArity
  }
, tryToRemoveMateriaFromItem() {
    if(!this.renderCurrentWeaponMateria.current) { return }
    this.renderCurrentWeaponMateria.removeCurrent()
    this.player.weapons[this.currentWeapon].materia = this.renderCurrentWeaponMateria.array
    this.materias.array = this.player.computeUnusedMaterias()
  }
, setActiveWeapon: function() {
    this.weapon = Object.keys(this.player.weapons)[0]
    this.currentWeapon = Object.keys(this.player.weapons)[0]
    this.renderCurrentWeaponMateria = new Round(this.player.weapons[this.weapon].materia)
    this.activeSprite = allSprites.get('weapon_'+this.weapon+'_large')
  }
}

function arrangeMateriaPreviewText(materiaText, ctx)  {
  return _.merge(
    materiaText
  , floatWithin(
      subRegion(padMenuBorder(paddedFullRegion(ctx)), [0,0.5,0.5,0.5])
    , ['top', 'left']
    , materiaText
    )
  )
}


function arrangeActiveWeapon(activeWeapon, ctx)  {
  return _.merge(
    activeWeapon
  , floatWithin(
      subRegion(padMenuBorder(paddedFullRegion(ctx)), [0,0,0.5,0.5])
    , ['middle']
    , activeWeapon
    )
  )
}

function paddedFullRegion(ctx) {
  return pad([0,0,ctx.width, ctx.height], config.tileSize)
}

function padMenuBorder(bounds) {
  return pad(bounds, config.menuBorderSize)
}

function drawModalBackground(ctx) {
  ctx.fillStyle = colors.menuModelBackgroundFade
  ctx.fillRect(0, 0, ctx.width, ctx.height)
}

function xywhObjHoldingSprite(sprite, x, y) {
  return {
    x: 0
  , y: 0
  , width: sprite.width
  , height: sprite.height
  , sprite: sprite
  , draw: draw
  }
}
