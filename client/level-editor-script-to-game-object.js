var commandResponders = scriptToObj.commandResponders = {
      'spawn': require('./spawn-from-script')
    , 'usable': require('./usable-from-script')
    , 'door': function() {}
    }
  , legitCommands = Object.keys(commandResponders)

module.exports = scriptToObj

function scriptToObj(levelEditorScript) {
  var responder = commandResponders[getCommand(levelEditorScript.script)]
  if(!responder) { return }
  return responder.apply(levelEditorScript, getArgs(levelEditorScript.script))
}

function getCommand(scriptText) {
  return scriptText.split(' ')[0]
}

function getArgs(scriptText) {
  return scriptText.split(' ').slice(1)
}

