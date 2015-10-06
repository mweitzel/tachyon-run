var fs = require('fs')
  , indexBody = fs.readFileSync('./public/build/index.html')

module.exports = function *root(){
  this.body = indexBody
  this.type = 'html'
}
