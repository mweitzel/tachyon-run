var Reader = require('./text-reader')
  , Menu = require('./base-menu')
  , enqueueFn = require('../enqueue-functions.js')
  , toViewportCoords = require('./to-viewport-coords')
  , regionHelper = require('./dialogue-region-helper')

module.exports = engageInDialogue

function engageInDialogue(core, arrayOfStrings, partyA, partyB, doneCB, altDoneCB) {
  if(dialogueIsQuestion(arrayOfStrings))
    return buildQuestion.apply(this, arguments)()
  else
    return buildReaderQueue.apply(this, arguments)()
}

function dialogueIsQuestion(arrayOfStrings) {
  return arrayOfStrings[0] === '\\QAR' //question answer response escape sequence
}

function buildReaderQueue(core, arrayOfStrings, partyA, partyB, doneCB, altDoneCB) {
  return enqueueFn(
    arrayOfStrings.map(function(dialogueString) {
      return newF.bind(Reader, core, dialogueString,
        generateDialogueRegion(core, dialogueString, partyA, partyB)
      )
    }).concat(doneCB || noop)
  )
}

function generateDialogueRegion(core, dialogueString, partyA, partyB, options) {
  return regionHelper.generateRegion(
    dialogueString
  , [partyA.bounds(), partyB.bounds()].map(function(bounds) {
      return toViewportCoords(core, bounds).concat([bounds[2], bounds[3]])
    })
  , [0,0,core.cameraSize.x,core.cameraSize.y]
  , options
  )
}

function buildQuestion(core, arrayOfStrings, partyA, partyB, doneCB) {
  var buildQuestionArgs = arguments
  var doneCBIndex = 4
  var questionText = arrayOfStrings[1]
  var responses = arrayOfStrings[3].split(":")
  var answers = arrayOfStrings[2].split(":").reduce(
    function(qaMap, answer, index) {
      qaMap[answer] = newF.bind(
        Reader, core, (responses[index] || through)
      , generateDialogueRegion(core, responses[index], partyA, partyB)
      , buildQuestionArgs[doneCBIndex + index] || doneCB || noop
      )
      return qaMap
    }, {}
  )

  var menuString = Menu.prototype.stringFromOptions(Object.keys(answers), 0)
  var menuRegion = generateDialogueRegion(
    core, menuString, partyB, partyA
  , { maxCharWidth: menuString.split('\n')[0].length, maxLines: menuString.split('\n').length }
  )
  return enqueueFn(
    [ newF.bind(Reader, core, questionText
      , generateDialogueRegion(core, questionText, partyA, partyB)
      )
    , newF.bind(Menu, core
      , { border: true, exitOnSelection: true, x: menuRegion[0], y: menuRegion[1] }
      , answers
      )
    ]
  )
}

function through(cb) { cb && cb() }

function noop() {}

function newF() {
  return new (bindAll(this, arguments))()
}

function bindAll(fn, args) {
  return Array.prototype.reduce.call(args, function(carryFn, arg) {
    return carryFn.bind(carryFn, arg)
  }, fn)
}
