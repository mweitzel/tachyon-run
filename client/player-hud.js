var Sprite = require('./sprite')
  , allSprites = require('./all-sprites')
  , healthTopLeft = [8, 8]
  , currentWeaponTopLeft = [8, 8 + 18]
  , hudBackgroundValue = 'rgba(31,61,128,0.8)'
  , hudForeground = 'rgba(212,237,255,1)'
  , playerHealthHudBackgroundMaxWidth = 50
  , config = require('./config')


module.exports = function(ctx, core) {
  drawPlayerHealth.call(this, ctx)
  if(this.currentWeapon) {
    ctx.fillStyle = hudBackgroundValue
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

function drawPlayerHealth(ctx) {
  var playerHealthHudBackgroundWidth = variableMaxWidth.call(this)
  var playerHealthHudForegroundMaxWidth = playerHealthHudBackgroundWidth
  var healthRatio = this.health / this.maxHealth
  var remainingHealthWidth = healthRatio * playerHealthHudForegroundMaxWidth - 4

  ctx.fillStyle = hudBackgroundValue
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
