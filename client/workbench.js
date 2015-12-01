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
  , materiaData = require('./materias')

module.exports = Workbench

function Workbench(core, player) {
  core.priorityStack.push(this)
  this.exit = core.removePriorityObj.bind(core, this)

  this.player = player
  this.renderCurrentWeaponMateria = new Round()
  this.materias = new Round(player.computeUnusedMaterias())
  this.panels = new Round([
    this.renderCurrentWeaponMateria
  , this.materias
  ])

  this.editableItems = new Round(Object.keys(this.player.weaponsConfig))

  this.setActiveWeapon()

  this.materiaPreview = new Rstring('')
  this.materiaPreview.backgroundColor = colors.transparent

  this.currentItemSlotsFilledText = new Rstring('')
  this.currentItemSlotsFilledText.backgroundColor = colors.transparent
}

Workbench.prototype = {
  draw: function(ctx) {
    ctx.fillStyle = colors.menuModelBackgroundFade
    ctx.fillRect.apply(ctx, [0,0,ctx.width,ctx.height])
    ctx.fillRect.apply(ctx, paddedFullRegion(ctx))
    ctx.fillRect.apply(ctx, paddedFullRegion(ctx))
    var pfRegion = paddedFullRegion(ctx)
    menuBorder(pfRegion)
    .draw(ctx)
    drawHBar(ctx)
    arrangeActiveWeapon(xywhObjHoldingSprite(this.activeSprite), ctx)
    .draw(ctx)
    arrangeMateriaPreviewText(this.materiaPreview, ctx)
    .draw(ctx)
    arrangeCurrentItemSlotsFilledText(this.currentItemSlotsFilledText, ctx)
    .draw(ctx)

    this.drawMateriaList(this.materias, availableMateriaRegion(ctx), this.isActivePanel(this.materias), true, 5, ctx)
    this.drawMateriaList(this.renderCurrentWeaponMateria, currentWeaponMateriaRegion(ctx), this.isActivePanel(this.renderCurrentWeaponMateria), false, 5, ctx)
  }
, isActivePanel: function(supposedlyPanel) {
    return this.panels.current === supposedlyPanel
  }
, drawMateriaList: function(materiaList, subRegionBounds, showSelected, displayPreviewTextToRight, maxDisplay, ctx) {
    var maxDisplay = maxDisplay || 5
    var tempText = new Rstring('')
    var selected = materiaList.current
    tempText.backgroundColor = colors.transparent
    var beginIndex = Math.floor(materiaList.index / maxDisplay) * maxDisplay
    var maxIndex = beginIndex + maxDisplay

    for(var i = beginIndex; i < maxIndex && i < materiaList.array.length; i++) {
      var yOffset = (i-beginIndex)*config.tileSize
      var materia = materiaList.array[i]
      draw.call(
        { sprite: allSprites.get(materia.split('_')[0])
        , x: subRegionBounds[0]
        , y: subRegionBounds[1] + yOffset
        }
      , ctx)
      if(showSelected && materia === selected ) {
        draw.call(
          { sprite: allSprites.get('selected')
          , x: subRegionBounds[0]
          , y: subRegionBounds[1] + yOffset
          }
        , ctx)
      }
      if(displayPreviewTextToRight) {
        tempText.string = generateMateriaListPreiewText(materia)
        tempText.x = subRegionBounds[0] + 1.5 * config.tileSize
        tempText.y = subRegionBounds[1] + yOffset
        tempText.draw(ctx)
      }
    }
    if(showSelected && materiaList.array.length === 0 ) {
        draw.call(
          { sprite: allSprites.get('selected')
          , x: subRegionBounds[0]
          , y: subRegionBounds[1] + i*config.tileSize
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
    if(core.input.getKeyDown(keys['['])) {
      this.editableItems.previous()
      this.setActiveWeapon()
    }
    if(core.input.getKeyDown(keys[']'])) {
      this.editableItems.next()
      this.setActiveWeapon()
    }
    if(core.input.getKeyDown(keys.SPACE)){
      if(this.panels.current === this.materias)
        this.tryToPutMateriaOnItem()
      else
        this.tryToRemoveMateriaFromItem()
    }
    this.materiaPreview.string = this.panels.current.current
    ? generateWorkbenchSynopsis(this.panels.current.current)
    : '--'
    this.currentItemSlotsFilledText.string = [
      this.renderCurrentWeaponMateria.array.length
    , this.getConfigObjectFromPlayerBasedOnCurrentEditable().materiaArity
    ].join('/')
  }
, tryToPutMateriaOnItem: function() {
    if(!this.currentWeaponHasOpenMateriaSlots()) { return }
    if(!this.materias.current) { return }
    this.player.weaponsConfig[this.editableItems.current].materia.push(this.materias.current)
    this.renderCurrentWeaponMateria.array = this.player.weaponsConfig[this.editableItems.current].materia
    this.materias.array = this.player.computeUnusedMaterias()
  }
, currentWeaponHasOpenMateriaSlots: function() {
    var actualWeaponConfig = this.getConfigObjectFromPlayerBasedOnCurrentEditable()
    return actualWeaponConfig.materia.length < actualWeaponConfig.materiaArity
  }
, tryToRemoveMateriaFromItem: function() {
    if(!this.renderCurrentWeaponMateria.current) { return }
    this.renderCurrentWeaponMateria.removeCurrent()
    this.player.weaponsConfig[this.editableItems.current].materia = this.renderCurrentWeaponMateria.array
    this.materias.array = this.player.computeUnusedMaterias()
  }
, setActiveWeapon: function() {
    this.renderCurrentWeaponMateria = new Round(this.getConfigObjectFromPlayerBasedOnCurrentEditable().materia)
    this.activeSprite = allSprites.get('weapon_'+this.editableItems.current+'_large')
    this.panels.array[0] = this.renderCurrentWeaponMateria
  }
, getConfigObjectFromPlayerBasedOnCurrentEditable: function() {
    return this.player.weaponsConfig[this.editableItems.current]
  }
}

function arrangeMateriaPreviewText(materiaText, ctx)  {
  return _.merge(
    materiaText
  , floatWithin(
      shiftBoundsXY(padMenuBorder(subRegion(paddedFullRegion(ctx), [0,0.5,1,0.5])), 0, -2)
    , ['top','left']
    , materiaText
    )
  )
}

function arrangeCurrentItemSlotsFilledText(text, ctx)  {
  return _.merge(
    text
  , floatWithin(
      currentWeaponMateriaRegion(ctx)
    , ['top', 'right']
    , text
    )
  )
}

function currentWeaponRegion(ctx) {
  return padMenuBorder(subRegion(paddedFullRegion(ctx), [0,0,0.5,0.5]))
}

function currentWeaponMateriaRegion(ctx) {
  return padMenuBorder(currentWeaponRegion(ctx))
}

function availableMateriaRegion(ctx) {
  return padMenuBorder(subRegion(paddedFullRegion(ctx), [0.5,0,0.5,0.5]))
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

function generateMateriaListPreiewText(materiaDataName) {
  var data = materiaData[materiaDataName]
  return (data && data.type) || materiaDataName
}

function generateWorkbenchSynopsis(materiaDataName) {
  var data = materiaData[materiaDataName]
  if(!data) { return materiaDataName }
  return [
    data.name
  , data.editor_description
  ].join('\n')
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

function shiftBoundsXY(bounds, shiftX, shiftY) {
  return [
    bounds[0] + shiftX
  , bounds[1] + shiftY
  , bounds[2]
  , bounds[3]
  ]
}

function drawHBar(ctx) {
  var pfRegion = paddedFullRegion(ctx)
  ctx.beginPath()
  ctx.strokeStyle = colors.circuitMenuDivider
  ctx.moveTo(pfRegion[0] + config.menuBorderSize,               pfRegion[1] + pfRegion[3]/2 + 0.5 + 2)
  ctx.lineTo(pfRegion[0] + pfRegion[2] - config.menuBorderSize, pfRegion[1] + pfRegion[3]/2 + 0.5 + 2)
  ctx.stroke()
}
