var test = require('tape')
  , dr = require('../../client/dialogue-region-helper')

test('can generate bounds to engulf formatted text', function(t) {
  var text = "000000000000000000000000000000000000000000000000000000"
      text += generateTextBlob(1000)
  var options = {
    maxCharWidth: 20
  , maxLines: 4
  }
  t.deepEquals(
    dr.generateBoundsToEngulf.call(options, text)
  , [0,0,176,80] // max sizes
  )
  t.deepEquals(
    dr.generateBoundsToEngulf.call(options, '1234')
  , [ 0
    , 0
    , /*border*/ 8*2 + 4*8 /*chars*/
    , /*border*/ 8*2 + 16  /*line*/
    ]
  )
  t.end()
})

test('translates center to x y', function(t) {
  t.deepEquals(
    dr.centerAt([50,50], [0,0,10,10])
  , [45,45,10,10]
  )
  t.end()
})

test('escapeCollisions returns original if there is nothing to avoid', function(t) {
  t.deepEquals(
    dr.escapeCollisions(
      [[]]
    , [0,0,10,10]
    )
  , [0,0,10,10]
  )
  t.end()
})

test('escapeCollisions moves box out of the way if it overlaps', function(t) {
  t.deepEquals(
    dr.escapeCollisions(      // (* marks 0,0)
      [[1,1,4,8]]             //
    , [0,0,10,10]             //    *---------            *    ---------
    )                         //    | --      |            -- |         |
  , [5,0,10,10]               //    ||  |     |  -->      |  ||         |
  )                           //    | --      |            -- |         |
  t.end()                     //     ---------                 ---------
})

test('escapeCollisions moves box out of the way of all things it overlaps', function(t) {
  t.deepEquals(
    dr.escapeCollisions(      // (* marks 0,0)
      [[1,1,4,8], [6,1,4,8]]  //
    , [0,0,10,10]             //    *---------            *         ---------
    )                         //    | --   -- |            --   -- |         |
  , [10,0,10,10]              //    ||  | |  ||  -->      |  | |  ||         |
  )                           //    | --   -- |            --   -- |         |
  t.end()                     //     ---------                     ---------
})

test('escapeCollisions moves box out of the way of all things it overlaps, shortest distance', function(t) {
  t.deepEquals(
    dr.escapeCollisions(      // (* marks 0,0)
      [[1,1,4,1], [6,1,4,1]]  //
    , [0,0,10,10]             //    *---------            *
    )                         //    | --   -- |            --   --
  , [0,2,10,10]               //    |         |  -->       ---------
  )                           //    |         |           |         |
  t.end()                     //     ---------            |         |
})                            //                          |         |
                              //                           ---------

test('antiViewport generates an array of bounds objects in shape of the inverted viewport', function(t) {
  t.deepEquals(
    dr.escapeCollisions(
      dr.antiViewport([1,2,30,40])
    , [0,0,10,10]
    )
  , [1,2,10,10]
  )
  t.end()
})

test('antiViewport generates an array of bounds objects in shape of the inverted viewport', function(t) {
  var huge = Math.pow(10, 10)
  t.deepEquals(
    dr.antiViewport([1,2,30,40])
  , [
      [ -huge, -huge, huge+1, 2*huge ]
    , [ -huge, -huge, 2*huge, huge+2 ]
    , [ -huge,    42, 2*huge,   huge ]
    , [    31, -huge, huge  , 2*huge ]
    ]
  )
  t.end()
})

test('generateRegion does a combination of everything _1', function(t) {
  t.deepEquals(
    dr.generateRegion("1234\n5678\n9012", [], [0,0,100,100])
  , [0,0,48,64]
  )
  t.end()
})

function generateTextBlob(charCount) {
  var chars = ['a','b','c',',','.','?','\n', ' ']
  var textBlob = ""
  for(var i = 0; i < charCount; i++ ){ textBlob += sample(chars) }
  return textBlob
}

function sample(arr) {
  return arr[Math.floor(Math.random()*arr.length)]
}
