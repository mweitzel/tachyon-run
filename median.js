module.exports = function() {
  return arguments.length % 2 == 0
  ? ((arguments[arguments.length/2-1] + arguments[arguments.length/2])/2)
  : arguments[(arguments.length-1)/2]
}
