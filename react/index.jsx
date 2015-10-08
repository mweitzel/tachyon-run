var React = require('react')
  , Canvas = require('./canvas')
  , canvasProps = require('../canvas-properties')

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
          <link rel="stylesheet" type="text/css" href="application.css">
          </link>
        </head>
        <body>
          <div className='canvas-container'>
            <Canvas {...canvasProps} />
          </div>
        </body>
      </html>
    )
  }
})
