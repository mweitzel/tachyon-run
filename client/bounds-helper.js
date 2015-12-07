module.exports = {
  center: function(b) {
    return [
      b[0] + b[2]/2
    , b[1] + b[3]/2
    ]
  }
, xyArrToObj: function(arr) {
    return { x: arr[0], y: arr[1] }
  }
}
