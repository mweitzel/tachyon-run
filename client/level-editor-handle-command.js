var _ = require('lodash')
  , Saver = require('./level-editor-serialize')
  , levelData = require('./level-data')

module.exports = handleCommand

var commands = {
  bg: function(saver, core, newColor) {
    var meta = _.find(core.entities, { layer: 'meta' })
    if( meta ) { meta.background = newColor }
  }
, load: function(saver, core, level) {
    if(!levelData[level]) {
      console.log('"'+level+'"', 'is not valid level')
      console.log('valid levels:\n-', Object.keys(levelData).join('\n- '))
      return
    }
    saver.load(
      core.entities
    , levelData[level]
    )
  }
, fail: function(core) {
    console.log('invalid command:', arguments)
  }
}

function handleCommand(saver, core, argString) {
  var args = argString.split(' ')
  var command = prepCommand(saver, core, args[0])
  command.apply(null, args.slice(1))
}

function prepCommand(saver, core, stringCommand) {
  var command = commands[trimLeadingSlash(stringCommand)]
  return command
  ? command.bind(null, saver, core)
  : commands.fail.bind(null, stringCommand)
}

function trimLeadingSlash(string) {
  return string[0] === '/' ? string.slice(1) : string
}
