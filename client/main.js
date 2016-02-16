var requires = {
  cssWatcher: require('./watch-scroll')
, betaSubmitter: require('./beta-submitter')
}
module.exports = main

function main() {
  requires.cssWatcher.watchScroll(this)
  requires.betaSubmitter.captureSubmit(this)
}
