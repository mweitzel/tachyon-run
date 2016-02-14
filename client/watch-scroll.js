module.exports = {
  watchScroll: function(window) {
    var headerHolder = window.document.getElementsByClassName('header-holder')[0]
    var contentBlocks = window.document.getElementsByClassName('colored-content-block')
    contentBlocks.filter = Array.prototype.filter.bind(contentBlocks)
    function thatHasScrolledThrough(element) {
      return element.offsetTop - (window.document.body.scrollTop + headerHolder.offsetHeight) <= 0
    }
    function byElementsOffsetTop(a, b) {
      return a.offsetTop > b.offsetTop
    }
    function computedBackgroundColor(element) {
      return window.getComputedStyle(element).backgroundColor
    }
    window.addEventListener('scroll', function(e) {
      headerHolder.style.backgroundColor = contentBlocks
        .filter(thatHasScrolledThrough)
        .sort(byElementsOffsetTop)
        .map(computedBackgroundColor)
        .pop()
    })
  }
}
