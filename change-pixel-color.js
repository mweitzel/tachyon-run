/*
    This module creates a .png with the same opacity,
    but turns all pixel colors to the provided value.

    Useful for checking player silhouettes
      or changing font colors

    Based off pngjs' example code
*/
var fs = require('fs')
  , PNG = require('pngjs').PNG
  , inFile = process.argv[2]
  , outFile = process.argv[3]
  , color = process.argv[4]

if(process.argv.length < 4
|| process.argv.indexOf('--help') >= 0
|| !color || color[0] !== '#' || color.length !== 7) {
  console.log([
    'Usage:'
  , "  node create-palette-from-png infile.png outfile.png '#22ee30'"
  ].join('\n'))
  process.exit()
}



fs.createReadStream(inFile)
  .pipe(new PNG({
      filterType: 4
  }))
  .on('parsed', function() {

    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        var idx = (this.width * y + x) << 2

        // invert color
        this.data[idx] =   parseInt(color.slice(1,3), 16)
        this.data[idx+1] = parseInt(color.slice(3,5), 16)
        this.data[idx+2] = parseInt(color.slice(5,7), 16)
      }
    }

    this.pack().pipe(fs.createWriteStream(outFile))
  })
