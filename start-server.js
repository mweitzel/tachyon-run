var initTime = new Date().getTime()
  , createServer = require('./server')
  , fetch = require('./fetch-env')
  , PORT = fetch('PORT')
  , host = porcess.env.HOST || 'production'

createServer.listen(fetch('PORT'))

console.log("Server running at http://"+host+":"+fetch('PORT')+"/")
console.log('started server in', new Date().getTime() - initTime, 'ms')
