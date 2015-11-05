module.exports = function(F, args) {
  return new (F.bind.apply(F,[{}].concat(args)))()
}
