var initTime = now()
require('./import-jsx')
var fs = require('fs')
  , path = require('path')
  , buildPath = path.resolve('public/build')
  , templatePath = 'react'
  , render = require('./html-render')
  , index = 'index'
  , template = path.resolve(templatePath, index+'.jsx')
  , buildTarget = path.resolve(buildPath, index+'.html')

module.exports = precompile

function precompile() {
  var index = 'index'
  fs.writeFileSync(buildTarget, render(template))
}

function now() {
  return new Date().getTime()
}

if(!module.parent) {
  precompile()
  console.log('precompiled in', now() - initTime, 'ms')
}
