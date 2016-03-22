module.exports = chain

function chain(data, transform) {
  return link((transform||pass)(data))
}

function link(data) {
  var _link = chain.bind(chain, (data))
  _link.value = data
  return _link
}

function pass(data) { return data }
