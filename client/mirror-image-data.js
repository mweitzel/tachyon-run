module.exports = typeof document === 'undefined'
? function(data) { return data }
: function(data) {
    var img = new Image()
    img.src = data

    var canvas = document.createElement('canvas')
    canvas.height = img.height
    canvas.width = img.width

    var ctx = canvas.getContext("2d");
    ctx.scale(-1, 1)
    ctx.drawImage(img, 0, 0, -img.width, img.height)

    return canvas.toDataURL()
  }
