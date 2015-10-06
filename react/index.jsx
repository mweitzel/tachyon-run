var React = require('react')

module.exports = React.createClass({
  setPath: function(newPath) {
    this.setState({pathname: newPath})
  }
, componentDidMount: function() {
    console.log('fullsite component did mount')
    console.log(this)
  }
, getInitialState: function() {
    return {pathname: this.props.initialPathname}
  }
, render: function() {
    var what = this
    return (
      <html id='html'>
        <head>
          <script src='index.js'>
          </script>
        </head>
        <body>hello world
        </body>
      </html>
    )
  }
})
