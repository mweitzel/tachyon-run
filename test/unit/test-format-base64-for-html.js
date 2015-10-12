var test = require('tape')
  , pack = require('../../format-base64-for-html')
  , fs = require('fs')
  , testOgg = ['ogg', fs.readFileSync('test/media/thunk.ogg', 'base64')]
  , testMp3 = ['mp3', fs.readFileSync('test/media/thunk.mp3', 'base64')]
  , testJpg = ['jpg', fs.readFileSync('test/media/banana.jpg', 'base64')]

test('packs ogg files', function(t) {
  t.plan(1)
  t.equal(
    pack.apply(pack, testOgg).slice(0,150)
  , 'data:application/ogg;base64,T2dnUwACAAAAAAAAAACP17RZAAAAABc5JuIBHgF2b3JiaXMAAAAAAUSsAAAAAAAAYOoAAAAAAAC4AU9nZ1MAAAAAAAAAAAAAj9e0WQEAAACl/enfDTr///////'
  )
})

test('packs mp3 files', function(t) {
  t.plan(1)
  t.equal(
    pack.apply(pack, testMp3).slice(0,150)
  , 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAZAAAX5gALCwseHh4eKioqKjg4ODhDQ0NDTU1NTVZWVlZfX19faWlpaXJycnJ7e3t7hYWFhY6Ojo6Xl5eXoaGh'
  )
})

test('packs jpg files', function(t) {
  t.plan(1)
  t.equal(
    pack.apply(pack, testJpg).slice(0,150)
  , 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEB'
  )
})
