var test = require('tape')
  , td = require('testdouble')
  , scriptToObj = require('../../client/level-editor-script-to-game-object')

test('recursive generator is passed to door', function(t) {
  t.plan(1)

  var saveDoor = scriptToObj.commandResponders.door
  scriptToObj.commandResponders.door = td.create()

  var existingObjGenerator = td.create()

  scriptToObj(existingObjGenerator, { script: 'door arg1 arg2' })

  t.doesNotThrow(function() {
    td.verify(scriptToObj.commandResponders.door(existingObjGenerator, 'arg1', 'arg2'))
  })

  scriptToObj.commandResponders.door = saveDoor
})

test.only('recursive generator is not passed to things other than door', function(t) {
  t.plan(1)

  scriptToObj.commandResponders.POTATO = td.create()

  var existingObjGenerator = td.create()

  scriptToObj(existingObjGenerator, { script: 'POTATO arg1 arg2' })

  t.doesNotThrow(function() {
    td.verify(scriptToObj.commandResponders.POTATO('arg1', 'arg2'))
  })

  delete scriptToObj.commandResponders.POTATO
})
