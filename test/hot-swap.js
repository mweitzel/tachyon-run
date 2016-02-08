module.exports = hotSwap

function hotSwap(obj, attr, temp) {
  var old = obj[attr]
  obj[attr] = temp
  return function() {
    obj.attr = old
  }
}
