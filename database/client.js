// Given a db url or an already connected client object, call a callback with the client and a
// "release" function.

// When given a db url, a new client is created (the pg module fetches it from it's internal pool)

// When given an existing client, that client is passed straight through to the callback and the
// release function is a noop

var pg = require('pg')

module.exports = dbClient

function dbClient(dbUrlOrClient, cb) {
  if (typeof dbUrlOrClient === 'string') return pg.connect(dbUrlOrClient, cb)
  return cb(null, dbUrlOrClient, noop)
}

dbClient.end = pg.end.bind(pg)

function noop(){}

var runExamples = !module.parent
if (runExamples) {
  // connect to local postgres master db
  dbClient('postgres:///postgres', function (err, clientFromPool, releaseToPool) {
    if (err) throw err
    // use that client again
    dbClient(clientFromPool, function(err, clientPassedIn, noopRelease) {
      if (err) throw err
      if (clientFromPool !== clientPassedIn) throw new Error('Not the same client!')
      noopRelease() // can be called, does nothing
      releaseToPool() // actual release
      pg.end()
    })
  })
}
