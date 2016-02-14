var React = require('react')
  , Nav = require('./left-nav')

module.exports = React.createClass({
  render: function() {
    return (
      <div className='text-content'>
        <div className='under-header'/>
        <div className='colored-content-block firstthing'>
          <Nav activeProp={'about'}/>
          <div className='column'>
            <h2>What is Tachyon Run?</h2>
            <p>
              Tachyon Run is a fast paced platformer with tight controls.
            </p>
            <p>
              The game is still under developmet. In the mean time you can register for the beta here, enjoy a small demo here, and leave me any feedback you have here!
            </p>
          </div>
        </div>
        <div className='colored-content-block secondthing'>
          <Nav activeProp={'beta-test'}/>
          <div className='column'>
            <h2>Beta Test</h2>
            <p>
              Instead of lorem ipsum, there will be a form.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
            </p>
          </div>
        </div>
        <div className='colored-content-block thirdthing'>
          <Nav activeProp={'share-it'}/>
          <div className='column'>
            <h2>Share it</h2>
            <p> Tweet me a haiku! </p>
            <p> Or Share  </p>
            <p> Or Leave Feedback </p>
          </div>
        </div>
        <div className='colored-content-block fourththing'>
          <Nav activeProp={'go-play'}/>
          <div className='column'>
            <h2>Go Play!</h2>
            <p> Enough already, let me play! </p>
            <p> link to play game </p>
          </div>
        </div>
      </div>
    )
  }
})
