var atlas = require('./atlas')

module.exports = function(ctx) {
  ctx.drawImage(
    atlas.image.mirror
  , 0 , 0 , 10 , 10 , 0 , 0 , 10 , 10
  )
}

/*
  there is a bug in Chrome
    where the "mirror" DOM element on "atlas"
      if it goes unused for a few garbage collection cycles
    intermittently
      but most frequently when chrome is using high amounts of RAM
    will throw an error*
  but can be avoided
    when this module is called early in the application's lifecycle

  I *think* its because chrome is collecting the image data as garbage
  but if you use it immediately, it is seen to have been used and leaves it

  * error:
    Failed to execute 'drawImage' on 'CanvasRenderingContext2D': The HTMLImageElement provided is in the 'broken' state.
    I _think_ this issue is being tracked here as WontFix https://code.google.com/p/chromium/issues/detail?id=388996
*/
