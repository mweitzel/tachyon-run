require('./import-jsx')
var browserify = require('browserify')
  , brfs = require('brfs')
  , sass = require('node-sass')
  , path = require('path')
  , fs = require('fs')

module.exports = function(page) {
  var ext = path.extname(page)
  if(!builders[ext]) return
  return builders[ext](page)
}

var builders = {
  '.js': function (page) {
    return browserify({
      entries: page
    , debug: true
    , trasform: brfs
    }).bundle()
  }
, '.scss': function(page) {
    return sass.renderSync({ file: page }).css
  }
, '.css': function(page) {
    return fs.createReadStream(page)
  }
}
