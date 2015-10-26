var test = require('tape')
  , td = require('testdouble')
  , Rstring = require('../../client/renderable-string')
  , CharSprite = require('../../client/renderable-character')

test('renderable string is collection of character sprites', function(t) {
  t.plan(2)
  var string = new Rstring('asdf')
  t.equal(string.chars.length, 'asdf'.length)
  t.ok(string.chars[0].sprite)
})

test('chars are drawn when string is drawn', function(t) {
  t.plan(1)
  var string = new Rstring('asdf')
  string.chars = new Array(5).fill().map(function() {return { draw: td.create() } })

  var ctx = {}
  string.draw(ctx)

  t.doesNotThrow(function(){
    string.chars.forEach(function(char) {
      td.verify(char.draw(ctx))
    })
  })
})

test('newlines are considered', function(t) {
  t.plan(3)
  var string = new Rstring('0\n12345\n6')
  t.equal(string.chars[0].y, 0)
  t.equal(string.chars[1].y, 16)
  t.equal(string.chars[6].y, 32)
})
