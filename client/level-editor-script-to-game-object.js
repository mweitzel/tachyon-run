var commandResponders = scriptToObj.commandResponders = {
      'spawn': require('./spawn-from-script')
    , 'usable': require('./usable-from-script')
    , 'door': require('./door-from-script')
    , 'load-player': require('./load-player-from-script')
    , 'transition': require('./transition-from-script')
    , 'region': require('./region-from-script')
    , 'delete-region': require('./delete-region-from-script')
    }
  , legitCommands = Object.keys(commandResponders)

module.exports = scriptToObj

function scriptToObj(recursiveSerializedToGOFn, levelEditorScript) {
  var responder = commandResponders[getCommand(levelEditorScript.script)]
  if(!responder) { return }
  if(getCommand(levelEditorScript.script) === 'door') {
    return responder.apply(levelEditorScript, [recursiveSerializedToGOFn].concat(getArgs(levelEditorScript.script)))
  }
  else {
    return responder.apply(levelEditorScript, getArgs(levelEditorScript.script))
  }
}

function getCommand(scriptText) {
  return scriptText.split(' ')[0]
}

function getArgs(scriptText) {
  return scriptText.split(' ').slice(1)
}

