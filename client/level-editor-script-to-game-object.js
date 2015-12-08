var commandResponders = scriptToObj.commandResponders = {
      'spawn': require('./spawn-from-script')
    , 'usable': require('./usable-from-script')
    , 'door': require('./door-from-script')
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

