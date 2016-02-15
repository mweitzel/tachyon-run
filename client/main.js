var requires = {
  cssWatcher: require('./watch-scroll')
}
module.exports = main

function main() {
  requires.cssWatcher.watchScroll(this)
  
}
