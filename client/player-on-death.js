var After = require('./after')
  , delay = seconds(3)
  , youJustDied = require('./you-just-died')

module.exports = function(core) {
  core.entities.push(
    new After(
      core.lastUpdate + delay
    , youJustDied
    )
  )
}

function seconds(num) {
  return num * 1000
}
