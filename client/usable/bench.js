var YN = require('../yes-no')
  , Workbench = require('../workbench')

module.exports = function(user, core) {
  new YN(
    core
  , 'Use workbench?'
  , function() {
      new Workbench(core, user)
    }
  , 'yes'
  , 'no'
  )
}
