var React = require('react')
  , Nav = require('./left-nav')

module.exports = React.createClass({
  render: function() {
    return (
      <div className='text-content'>
        <div className='under-header bg-sun-blue'/>
        <div className='colored-content-block bg-sun-blue'>
          <Nav activeProp={'about'}/>
          <div className='column'>
            <div>
              <h3>What is Tachyon Run?</h3>
              <p>
                Tachyon Run is a platformer game with tight controls. It takes place throughout the galaxy during a new age of discovery.
              </p>
              <p>
                The game is currently under development. In the mean time you can <a href="#beta-test">register</a> for the beta or <a href="#play">play</a> the small demo.
              </p>
            </div>
          </div>
        </div>
        <div className='colored-content-block bg-sun-red'>
          <Nav activeProp={'beta-test'}/>
            <div className='column'>
              <div>
              <h3>Beta Test</h3>
              <p>
                If you would like to participate in the beta when it is available or be informed when the game is released, please submit your email.
              </p>
              <form className='beta-submit' method="post">
                <div className='error'/>
                <div className='success'/>
                <input type='email' required placeholder='you@example.com'/>
                <br/>
                <input type='submit' value='submit'/>
              </form>
              <p>
                I won't spam or sell your email to anyone, I can't stand that either.
              </p>
            </div>
          </div>
        </div>
        <div className='colored-content-block bg-sun-l-orange'>
          <Nav activeProp={'play'}/>
          <div className='column'>
            <div>
            <h3>Play</h3>
            <p> Ok, here's a link to the <a href="/demo">demo</a>. I would love any notes or feedback if you have any.</p>
          </div>
          </div>
        </div>
        <div className='colored-content-block bg-sun-d-orange'>
          <Nav activeProp={'contact'}/>
          <div className='column'>
            <div>
              <h3>Contact</h3>
              <p>
                I'm Matthew Weitzel
                <br/>I tweet thoughts <a href="https://twitter.com/weitzelb">@weitzelb</a>
                <br/>you can reach me there
              </p>
            </div>
          </div>
        </div>
        <div className='colored-content-block bg-sun-l-teal'>
          <Nav activeProp={'source'}/>
          <div className='column'>
            <div>
              <h3>Source Code</h3>
              <p>
                I've always been inspired by early consoles and their developers, so I decided to self-impose a modest size constraint of 1MB, assets included.
              </p>
              <img className='pixel-art float-right content-inline-image' src="terminal-dude.gif" width='140'/>
              <p>
                The game is handwritten in JS, including a very tiny engine. Everything is easy to test and builds are fast and light.
              </p>
              <p>
                All <a href="https://github.com/mweitzel/tachyon-run">game code</a> and <a href="https://github.com/mweitzel">supporting libraries</a> are open source.
                I hope some of you may benefit from the code as well as the end product.
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
