var React = require('react')

var ATag = React.createClass({
  render: function() {
    var href = "#"+this.props.name
    var capitalizedName = this.props.name.split('-').join(' ')
    return (
      <a href={href} >
        {capitalizedName}
      </a>
    )
  }
})

module.exports = React.createClass({
  render: function() {
    var navList = ['about', 'beta-test', 'play', 'contact', 'source']
    var activeProp = this.props.activeProp
    return (
      <div className='nav'>
        <div id={activeProp} className='anchor'/>
        <ul>
          {navList.map(function(name){
            var active = (activeProp === name) ? 'active' : ''
            return (
              <li className={active} >
                <ATag name={name} />
              </li>
            )
          })}
        </ul>
      </div>
    )
  }
})
