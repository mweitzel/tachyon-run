var test = require('tape')
  , tf = require('../../text-formatter')

test('you can specify a max character, and it creates newline before preceeding words', function(t) {
  var text = 'apples taste so good'
  t.plan(1)
  t.equal(
    tf(text, 20)
   //12345678901234567890 chars
  , 'apples taste so good'
  )
})


test('you can specify a max character, and it creates newline before preceeding words', function(t) {
  var text = 'apples taste so good i would eat them with peanut butter all day'
  t.plan(1)
  t.equal(
    tf(text, 20)
  , [//12345678901234567890 chars
      'apples taste so good'
    , 'i would eat them'
    , 'with peanut butter'
    , 'all day'
    ].join('\n')
  )
})

test('words that are so long are split at the correct place', function(t) {
  t.plan(1)
  var text = '12345678901234567890123456789012345678901234567890123456789012345678901234567890'
  t.equal(
    tf(text, 20)
  , [//12345678901234567890 chars
      '12345678901234567890'
    , '12345678901234567890'
    , '12345678901234567890'
    , '12345678901234567890'
    ].join('\n')
  )
})

test('almost too long word gets newline and is not split', function(t) {
  t.plan(1)
  var text = 'asdf 1234567890'
  t.equal(tf(text, 10), 'asdf\n1234567890')
})

test('too long of word gets remainder on current line, then the rest on following', function(t) {
  t.plan(1)
  var text = '123456 8901234567890'
  t.equal(tf(text, 10), '123456 890\n1234567890')
})

test('full line followed by long ass word splits properly', function(t) {
  t.plan(1)
  var text = '12345 7890 12345678901234567890'
  t.equal(tf(text, 10), '12345 7890\n1234567890\n1234567890')
})

test('passed new line chars (\\n) create own newlines', function(t) {
  t.plan(2)
  var text = "he's dead, jim\n...but\n..that is impossible"
  t.equal(tf(text, 100), text)
  t.equal(
    tf(text, 10)
  , [ "he's dead,"
    , 'jim'
    , '...but'
    , '..that is'
    , 'impossible'
    ].join('\n')
  )
})
