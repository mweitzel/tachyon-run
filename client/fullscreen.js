module.exports = {
  doubleClickToggle: function(element) {
    ELEM = element
    element.addEventListener('dblclick', function(e) {
      element.webkitRequestFullScreen()
    })
  }
}
