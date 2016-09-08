var React = require('react')

module.exports = React.createClass({
  render: function() {
    return (
      <div className='header-holder'>
        <div className='tile' />
        <div className='left' />
        <div className='words'>
          <h1> Tachyon Run </h1>
          <h2> Sign up for Alpha Testing </h2>
          <a href="/"/>
        </div>
      </div>
    )
  }
})
