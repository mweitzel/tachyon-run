var sql = require('sql')

module.exports = {
  betaSignup: sql.define({
    name: 'beta-signup'
  , columns: [
      { name: 'id', dataType: 'varchar(100)', unique: true, notNull: true }
    , { name: 'email', dataType: 'varchar(100)', unique: true, notNull: true }
    , { name: 'timestamp', dataType: 'timestamp with time zone not null' }
    ]
  })
}
