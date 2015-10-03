var initTime = new Date().getTime()
var createServer = require('./server')

createServer.listen(8000)

console.log("Server running at http://127.0.0.1:8000/")
console.log('started server in', new Date().getTime() - initTime, 'ms')
