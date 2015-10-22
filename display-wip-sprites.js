var imgcat = require('img-cat')
  , path = require('path')
  , params = process.argv.slice(2).sort(byLastChunkAsInt)
  , files = params.filter(isNotFpsArg)
  , fps = parseInt((params.filter(isFpsArg).pop() || '--fps=5').slice(6))
  , twoHundredBlankLines = new Array(200).join('\n')


function isFpsArg(str) { return str.indexOf('--fps=') >= 0 }
function isNotFpsArg(str) { return !isFpsArg(str) }
function byLastChunkAsInt(str1, str2) { return lastChunkAsInt(str1) > lastChunkAsInt(str2) }
function lastChunkAsInt(string) { return parseInt(string.split('_').pop()) }

function displayQueue(queue, i) {
  var fileName = queue[i]
  var resoveldPath = path.resolve(fileName)
  imgcat
    .fromFile(fileName)
    .then(function(ansi) {
      console.log(twoHundredBlankLines + ansi)
      console.log('Current File:\n  ', fileName)
      console.log('Command:\n  ', process.argv.join(' \\\n    '))
      setTimeout(function(){
        displayQueue(queue, (i+1) % queue.length)
      }, 1000/fps)
    })
}

function displayUsage() {
  console.log([
    'Example Usages:'
  , '  node display-wip-sprites.js sprites/charles*.png --fps=3'
  , '  node display-wip-sprites.js file1 file2 file3'
  , ''
  , 'Files are sort by last occurance of _INT in file name'
  ].join('\n'))
}

if(!module.parent) {
  if(params.length === 0) { return displayUsage() }
  console.log(twoHundredBlankLines)
  displayQueue(files, 0)
}
