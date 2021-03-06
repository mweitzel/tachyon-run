var React = require('react')
  , Canvas = require('./canvas')
  , IncompatibleBrowser = require('./incompatible-browser')
  , Header = require('./header')
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
          <script src='game.js'>
          </script>
          <link rel="stylesheet" type="text/css" href="application.css">
          </link>
        </head>
        <body>
          <div className='canvas-container stretch-to-margin bg-sun-d-teal'>
            <Header/>
            <div className='under-header bg-sun-d-teal'/>
            <Canvas {...canvasProps} />
            <IncompatibleBrowser />
            <p className='center white'>Control with  ←, →, ↑, ↓, x and z</p>
            <p className='center white'>double click to fullscreen</p>
          </div>
        </body>
      </html>
    )
  }
})
