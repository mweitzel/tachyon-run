module.exports = {
  doubleClickToggle: function(element) {
    element.addEventListener('dblclick', function(e) {
      element.webkitRequestFullScreen && element.webkitRequestFullScreen()
      element.mozRequestFullScreen && element.mozRequestFullScreen()
    })
  }
}
