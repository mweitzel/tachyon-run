module.exports = function *notFound() {
  this.status = 404
  this.body = '404 - page not found'
}
