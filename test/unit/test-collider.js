var test = require('tape')
  , collider = require('../../client/collider')

test('#intersects finds overlapping boxes', function(t) {
/*
 -----
|     |
|    -+---
|   | |   |
 ---+-    |
    |     |
     -----
*/
  t.plan(1)
  var b1 = [10,10,5,5]
    , b2 = [8,8,4,4]
  t.true(collider.intersects(b1, b2))
})

test('#intersects rejects non overlapping boxes', function(t) {
/*
  ---
 |   |
 |   | ----- 
  --- |     |
      |     |
       ----- 
*/
  t.plan(1)
  var b1 = [10,10,5,5]
    , b2 = [5,5,4,4]
  t.false(collider.intersects(b1, b2))
})

test('#intersects finds oddly boxes', function(t) {
/*
    ---
   |   |
   |   |
 --+---+-----
|  |   |     |
 --+---+-----
   |   |
    ---
*/
  t.plan(1)
  var b1 = [10,10,2,10]
    , b2 = [8, 12, 10, 2]
  t.true(collider.intersects(b1, b2))
})
