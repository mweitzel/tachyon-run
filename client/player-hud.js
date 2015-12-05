var Sprite = require('./sprite')
  , allSprites = require('./all-sprites')
  , healthTopLeft = [8, 8]
  , currentWeaponTopLeft = [8, 8 + 18]
  , colors = require('./colors')
  , hudForeground = colors.hudForeground
  , hudBackground = colors.hudBackground
  , hudBackgroundValues = colors.hudBackgroundValues
  , hudWarningBackgroundValues = colors.hudWarningBackgroundValues
  , playerHealthHudBackgroundMaxWidth = 50
  , config = require('./config')
  , oscillate = require('../oscillate-between-values')


module.exports = function(ctx, core) {
  drawPlayerHealth.call(this, ctx, core)
  if(this.currentWeapon) {
    ctx.fillStyle = hudBackground
    drawOval(ctx, currentWeaponTopLeft[0], currentWeaponTopLeft[1], config.tileSize, config.tileSize)
    drawSpriteAt.call(
      ctx
    , ['weapon', this.currentWeapon.weaponName, 'small'].join('_')
    , currentWeaponTopLeft
    )
  }
}

function drawOval(ctx, x, y, w, h) {
  ctx.beginPath()
  ctx.rect(x + 2, y    , Math.max(0, w - 4) , Math.max(h    ))
  ctx.rect(x + 1, y + 1, Math.max(0, w - 2) , Math.max(h - 2))
  ctx.rect(x    , y + 2, Math.max(0, w    ) , Math.max(h - 4))
  ctx.fill()
}

function drawPlayerHealth(ctx, core) {
  var playerHealthHudBackgroundWidth = variableMaxWidth.call(this)
  var playerHealthHudForegroundMaxWidth = playerHealthHudBackgroundWidth
  var healthRatio = this.health / this.maxHealth
  var remainingHealthWidth = Math.ceil(healthRatio * playerHealthHudForegroundMaxWidth - 4)

  ctx.fillStyle = healthRatio >= 1/3
  ? hudBackground
  : oscilateBackgroundToRed(core.lastUpdate)

  drawOval(ctx, healthTopLeft[0], healthTopLeft[1], playerHealthHudBackgroundWidth, 16)
  ctx.fillStyle = hudForeground
  drawOval(ctx, healthTopLeft[0]+2, healthTopLeft[1]+2, remainingHealthWidth, 16-4)
}

function variableMaxWidth() {
  return this.health == this.maxHealth
  ? 16
  : playerHealthHudBackgroundMaxWidth
}

function drawSpriteAt(name, topLeft) {
  Sprite.draw.call(
    { spriteX: topLeft[0]
    , spriteY: topLeft[1]
    , sprite: allSprites.get(name)
    }
  , this
  )
}

function buildWarningRGBA(time) {
  return [
    oscillate(hudBackgroundValues[0], hudWarningBackgroundValues[0], time)
  , oscillate(hudBackgroundValues[1], hudWarningBackgroundValues[1], time)
  , oscillate(hudBackgroundValues[2], hudWarningBackgroundValues[2], time)
  ].map(Math.round.bind(Math))
   .concat(
     oscillate(hudBackgroundValues[3], hudWarningBackgroundValues[3], time)
    )
}

function oscilateBackgroundToRed(time) {
  var slow = 100
  return [
    'rgba('
  , buildWarningRGBA(time/slow)
    .join(',')
  , ')'
  ].join('')
}
