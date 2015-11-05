var test = require('tape')
  , scriptToObj = require('../../client/level-editor-script-to-game-object')

test('do nothing if command is illegal', function(t) {
  t.plan(1)
  t.equal(
    scriptToObj({script: 'illegalCommand scripts are rejected and retun undefined'})
  , undefined
  )
})

test(
  [ 'if command responder exists,'
  , 'invokes command responder of script\'s first arg\'s name'
  , 'with script object as this and remaining args applied'
  ].join(' ')
, function(t) {
  t.plan(1)
  // exemplify both "this" and arguments
  scriptToObj.commandResponders.test_1 = function() {
    return [
      this.a
    , Array.prototype.slice.call(arguments)
    ]
  }
  t.deepEqual(
    scriptToObj({a: 'hello', script: 'test_1 first second third'})
  , ['hello', ['first', 'second', 'third']]
  )
  delete scriptToObj.commandResponders.test_1
})
