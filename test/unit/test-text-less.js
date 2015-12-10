var test = require('tape')
  , tl = require('../../text-less')

test('calling proceed adds one character to the viewer', function(t) {
  t.plan(6)
  var tlObj = tl('hello there people')
  t.equal(tlObj.text, '')
  t.equal(tlObj.proceed().text, 'h')
  t.equal(tlObj.proceed().proceed().text, 'he')
  t.equal(tlObj.proceed().proceed().proceed().text, 'hel')
  t.equal(tlObj.proceed().proceed().proceed().proceed().text, 'hell')
  t.equal(tlObj.proceed().proceed().proceed().proceed().proceed().text, 'hello')
})

test('calling proceed trims window by newline at back of buffer', function(t) {
  t.plan(3)
  t.equal(
    tl('a\nb\nc', 2).proceed().proceed().proceed().text
  , 'a\nb'
  )
  t.equal(
    tl('a\nb\nc', 2).proceed().proceed().proceed().proceed().text
  , 'b\n'
  )
  t.equal(
    tl('a\nb\nc', 2).proceed().proceed().proceed().proceed().proceed().text
  , 'b\nc'
  )
})

test('only done if all characters showing', function(t) {
  t.plan(2)
  t.equal(
    tl('abc', 2).proceed().proceed().done
  , false
  )
  t.equal(
    tl('abc', 2).proceed().proceed().proceed().done
  , true
  )
})
