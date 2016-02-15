var db = require('./client')
  , models = require('./models')
  , dbUrl = process.env.POSTGRES_URL


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
