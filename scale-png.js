var fs = require('fs')
  , _ = require('lodash')
  , PNG = require('pngjs').PNG
  , inFile = process.argv[2]
  , outFile = process.argv[3]
  , scaler = parseInt(process.argv[4])

if(process.argv.length < 3 || process.argv.indexOf('--help') >= 0) {
  console.log([
    'Usage: (to scale by 10)'
  , '  node scale-png infile.png outfile.png 10'
  ].join('\n'))
  process.exit()
}

fs.createReadStream(inFile)
  .pipe(new PNG({
      filterType: 4
  }))
  .on('parsed', function() {
    var pixels = []
    for(var y = 0; y < this.height; y++) {
      var row = []
      for(var x = 0; x < this.width; x++) {
        var index = (this.width * y + x ) << 2
        var current = this.data.slice(index, index+4)
        _.times(scaler, function(){ row.push(current) })
      }
      _.times(scaler, function(){ pixels.push(row) })
    }
    pixels = _.flatten(pixels)

    this.data = Buffer.concat(pixels)
    this.width = this.width * scaler
    this.height = this.height * scaler
    this.pack().pipe(fs.createWriteStream(outFile))
  })
