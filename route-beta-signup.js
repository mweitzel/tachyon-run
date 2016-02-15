var parse = require('co-body')
  , thunkify = require('thunkify')
  , models = require('./database/models')
  , dbUrl = process.env.POSTGRES_URL
  , db = require('./database/client')
  , thunkDb = thunkify(db)
  , uuid = require('uuid').v4
  , validator = require('validator')

module.exports = betaSignup

function *betaSignup(page, next) {
  var supposedEmail = (yield parse(this, { limit: '1kb' })).email+""
  var sanitizedEmail = validator.normalizeEmail(supposedEmail)

  if(!sanitizedEmail) { return failNonEmail(this, supposedEmail) }
  try { JSON.stringify(yield tryToAddIt(this, sanitizedEmail)) }
  catch(e) { throw e }

}

function *tryToAddIt(context, email) {
  var client_done = yield thunkDb(dbUrl)
    , client = client_done[0]
    , done = client_done[1]
  var query = thunkify(client.query.bind(client))
  var insertSql = models.betaSignup.insert({email: email, id: uuid()}).toQuery()
  try{ yield query(insertSql) }
  catch(e) {
    done()
    if(validatesUniqueEmail(e)) { return failNonUniqueEmail(context, this) }
    throw e
  }
  done()
  context.body = JSON.stringify(
    { success: true, value: {email: email }}
  )
}

function failNonEmail(context, badEmail) {
  context.body = buildFailResponse('"'+badEmail+'"'+' is not a valid email')
}

function buildFailResponse(message) {
  return JSON.stringify(
    { success: false , value: { 'error': message } }
  )
}

function validatesUniqueEmail(e) {
  return (
       e
    && e.message
    && e.message === 'duplicate key value violates unique constraint "beta-signup_email_key"'
  )
}

function failNonUniqueEmail(context) {
  context.body = buildFailResponse('email has already been submitted')
}
