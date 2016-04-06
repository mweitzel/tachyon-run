var db = require('./client')
  , models = require('./models')
  , fetch = require('../fetch-env')
  , dbUrl = fetch('POSTGRES_URL')

db(dbUrl, function(err, client, done) {
  if(err) { throw err }
  client.query(
    models.betaSignup.create().ifNotExists().toQuery()
  , function(err, result) {
      if(err) { throw err }
      done()
      db.end()
  })
})
