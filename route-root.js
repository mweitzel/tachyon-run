var indexTemplate = './react/index.jsx'
  , render = require('./html-render')

module.exports = function *root(){
  this.body = render(indexTemplate)
  this.type = 'html'
}
