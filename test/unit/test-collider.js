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

test('#intersects finds perfectly overlapping boxes', function(t) {
/*
    ---
   |   |   <- actually two boxes
   |   |
    ---
*/
  t.plan(1)
  var b1 = [10, 10, 10, 10]
    , b2 = [10, 10, 10, 10]
  t.true(collider.intersects(b1, b2))
})

test('collidingSide returns left when left is closest', function(t) {
/*
  -------
 |       |
 |       | ---------
  ------- | subject |
           ---------
*/
  t.plan(1)
  var subjectBounds = [10,10,10,10]
  var colliderBounds = [0,0,10,11]
  t.equal(
    collider.collidingSide(subjectBounds, colliderBounds)
  , 'left'
  )
})

test('collidingSide returns right when right is closest', function(t) {
/*
              ------
             |      |
  ---------  |      |
 | subject |  ------
  ---------
*/
  t.plan(1)
  var subjectBounds =  [ 0,10,10,10]
  var colliderBounds = [11, 0,11,12]
  t.equal(
    collider.collidingSide(subjectBounds, colliderBounds)
  , 'right'
  )
})

test('collidingSide returns top when top is closest', function(t) {
/*

 ------
|      |
|      |
 ------
  ---------
 | subject |
  ---------
*/
  t.plan(1)
  var subjectBounds =  [ 1,11,10,10]
  var colliderBounds = [ 0, 0,10,10]
  t.equal(
    collider.collidingSide(subjectBounds, colliderBounds)
  , 'top'
  )
})

test('collidingSide returns bottom when bottom is closest', function(t) {
/*
  ---------
 | subject |
  ---------
 ------
|      |
|      |
 ------
*/
  t.plan(1)
  var subjectBounds =  [ 1, 0,10,10]
  var colliderBounds = [ 0,11,10,10]
  t.equal(
    collider.collidingSide(subjectBounds, colliderBounds)
  , 'bottom'
  )
})

test('collidingSide when no axis overlap, returns closest', function(t) {
/*
 ---------
| subject |
 ---------
                      ------
                     |      |
                     |      |
                      ------
*/
  t.plan(1)
  var subjectBounds =  [  0, 0,10,10]
  var colliderBounds = [ 20,11,10,10]
  t.equal(
    collider.collidingSide(subjectBounds, colliderBounds)
  , 'bottom'
  )
})
