/*
  bounds: [x,y,w,h]
  // using bounds as an origin, what percentage of bounds should each piece be?
  fractionalCoords: [
    fractionalWidthFromOrigin
  , fractionalHeightFromOrigin
  , fractionalWidth
  , fractionalHeight
  ]
*/

module.exports = subRegion

function subRegion(bounds, fractionalCoords) {
  return [
    bounds[0] + fractionalCoords[0] * bounds[2]
  , bounds[1] + fractionalCoords[1] * bounds[3]
  , fractionalCoords[2] * bounds[2]
  , fractionalCoords[3] * bounds[3]
  ]
}

/*

[x,y]
  -> *---------------------------------
     |           |                     |
     |   A      1/3         B          |
     |           |                     |
     |           |                     |
     |--1/3------+---------2/3---------|
     |           |                     |
     |           |                     |
     |           |                     |
     |   C      2/3         D          |
     |           |                     |
     |           |                     |
     |           |                     |
      ---------------------------------*
                                       ^- [x+w, y+h]

assuming the outer box is defined by bounds b

region A could be obtained calling:
  subRegion(b, [0,0,1/3,/13])
region B with:
  subRegion(b, [1/2,0,2/3,1/3]
region C with:
  subRegion(b, [0,1/3,1/3,2/3]
region D with:
  subRegion(b, [1/3,1/3,2/3,2/3]
*/
