module.exports = chain

function chain(data, transform) {
  return link((transform||pass)(data))
}

function link(data) {
  var chainLink = chain.bind(chain, (data))
  chainLink.value = data
  return chainLink
}

function pass(data) { return data }
