module.exports = {
  readers: {
    demo_intro: [
      'Hello!'
    , "The game is work in progress, but somehow you've stumbled upon this demo."
    , ''
    , 'Two important things:'
    , '1 - double-click to enter fullscreen, esc to leave.'
    , '2 - controls are: z, x, and arrow keys'
    , ''
    , "..that's it, now go run and jump!"
    ].join('\n') // just '\n', not ' \n' as intro should have no full stop
  , demo_outro: [
      'Hello Again!'
    , 'You have reached the end of the shortest demo ever.'
    , ''
    , 'This door leads to some levels I use to test controls and game mechanics.'
    , ''
    , 'So instead of calling this the end, you can play around there!'
    ].join('\n') // just '\n', not ' \n' as intro should have no full stop
  , test_1: [
      'sup yooooooo, how is it?'
    , 'not much, having a blast'
    , 'is it  ..wednesday?'
    + ' probably...\nBut I\'d never know for sure..'
    , 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?'
    , 'end'
    ].join(' \n')
  }
, dialogues: {
    azalea: {
      intro: [
        "I found one."
      , "The message contains an l-key, but I don't recognize any of the star systems."
      , "Yea, weird."
      , "No, just the one so far, it was practically plaintext."
      , "There's definitely more. This data is crazy, with interlaced payloads, and- \nwhere'd you say you found this?"
      , "Yea yea, you never do say."
      ]
    , intro_pester: [
      , "I don't know if I can pull anything else out, but I'll keep running it."
      ]
    , intro_pre_teleport: [
        "You want to USE the l-key!?"
      , "We don't have any idea where it goes!"
      , "..."
      , "Alright, I'll configure the port. But if this goes hayshit its on you."
      ]
    , intro_on_teleport: [
        "\\QAR" //question answer response
      , "You sure you want to do this?"
      , "Absolutely:Then again.."
      , [ "Good luck, and try not to die."
        , "Yea, I'm not a fan of blindly pitching myself into god-knows-which corner of the galaxy either."
        ].join(':')
      ]
    }
  }
}
