module.exports = function(name) {
  if(envContains(name)) return process.env[name]
}

function envContains(name) {
  if(Object.getOwnPropertyNames(process.env) && process.env[name] !== undefined)
    return true
  throw "process.env does not contain variable '"+name+"'"
}
