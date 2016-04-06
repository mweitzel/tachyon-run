module.exports = function(name) {
  if(envContains(name)) return process.env[name]
}

function envContains(name) {
  if(Object.getOwnPropertyNames(process.env) && process.env[name] !== undefined)
    return true
  else
    throw new Error("process.env does not contain variable '"+name+"'")
}
