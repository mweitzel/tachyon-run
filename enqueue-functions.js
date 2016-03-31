module.exports = enqueueFns

function enqueueFns(array) {
  return Array.prototype
  .reverse.call(array)
  .reduce(function(previous, current) {
    return current.bind(current, previous)
  })
}
