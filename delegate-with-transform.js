module.exports = function(delegator, delegatee, jobName, getTransform) {
  Object.defineProperty(delegator, jobName, {
    get: function() {
      if(typeof getTransform === 'function') {
        return getTransform(delegatee[jobName])
      }
      return delegatee[jobName]
    }
    , configurable: true
  })
}
