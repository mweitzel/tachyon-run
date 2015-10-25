var fs = require('fs')
  , _ = require('lodash')
  , PNG = require('pngjs').PNG
  , inFile = process.argv[2]
  , outFile = process.argv[3]

if(process.argv.length < 3 || process.argv.indexOf('--help') >= 0) {
  console.log([
    'Usage:'
  , '  node create-palette-from-png infile.png outfile.png'
  ].join('\n'))
  process.exit()
}


fs.createReadStream(inFile)
  .pipe(new PNG({
      filterType: 4
  }))
  .on('parsed', function() {
    var pixels = []
    for(var i = 0; i < this.data.length-3; i += 4)
      pixels.push(this.data.slice(i, i+4))

    pixels = _.unique(pixels, function(b) { return [b[0], b[1], b[2], b[3]].toString() })
    pixels = _.sortBy(pixels, lightEmitted)

    pixels.push(pixel(  0,  0,  0,255)) // black
    pixels.push(pixel(127,127,127,255)) // grey
    pixels.push(pixel(255,255,255,255)) // white
    pixels.push(pixel(  0,  0,  0,  0)) // transparent

    var squareLength = Math.ceil(Math.sqrt(pixels.length))
    while(pixels.length < Math.pow(squareLength, 2))
      pixels.push(pixel(0,0,0,0))


    this.data = Buffer.concat(pixels)

    var squareLength = Math.ceil(Math.sqrt(this.data.length/4))
    this.width = squareLength
    this.height = squareLength

    this.pack().pipe(fs.createWriteStream(outFile))
  })

function lightEmitted(p) {
 return (p[0] + p[1] + p[2]) * p[3]
}

function pixel(r, g, b, a) {
  var buff = new Buffer(4)
  for(var i = 0; i < 4; i++)
    buff[i] = arguments[i]
  return buff
}
