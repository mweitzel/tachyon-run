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
              If you would like to participate in the beta or be informed when the game is released, please submit your email below.
            </p>
            <form className='beta-submit' method="post">
              <input type='text-area' required placeholder="Tell me a fun fact so I know you're a human"/>
              <br/>
              <input type='email' required placeholder='youremail@example.com'/>
              <br/>
              <input type='submit' value='submit'/>
            </form>
            <p>
              Don't worry, I won't spam or sell your email to anyone, I can't stand that crap either.
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
            <p> Ok, here's <a href="/demo">a link to teaser level</a></p>
          </div>
        </div>
      </div>
    )
  }
})
