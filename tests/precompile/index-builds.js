var test = require('tape')
  , precompiler = require('../../precompile')
  , fs = require('fs')
  , exec = require('child_process').exec
  , path = require('path')
  , buildPath = path.resolve('public/build')
  , builtIndexPath = path.resolve(buildPath, 'index.html')

test('index builds when precompiler is called', function(t) {
  t.plan(3)
  exec('./bin/precompile', function(err, message) {
    if(err) { return t.end(err) }
    t.ok(fs.existsSync(buildPath))
    t.ok(fs.existsSync(builtIndexPath))
    var startString = '<html id="html">'
    var fileBeginning = fs.readFileSync(builtIndexPath, {encoding:'utf-8'})
                          .slice(0, startString.length)
    t.equal(fileBeginning, startString)
  })
})
