require('./import-jsx')
var React = require('react')

module.exports = function(jsxTemplate, properties) {
  var factory = React.createFactory(require(jsxTemplate))
  return React.renderToStaticMarkup(factory(properties))
}
