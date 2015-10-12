var test = require('tape')
  , pack = require('../../file-to-html5-data')
  , testOgg = 'test/media/thunk.ogg'
  , testMp3 = 'test/media/thunk.mp3'
  , testJpg = 'test/media/banana.jpg'

test('packs ogg files', function(t) {
  t.plan(1)
  t.equal(
    pack(testOgg).slice(0,150)
  , 'data:application/ogg;base64,T2dnUwACAAAAAAAAAACP17RZAAAAABc5JuIBHgF2b3JiaXMAAAAAAUSsAAAAAAAAYOoAAAAAAAC4AU9nZ1MAAAAAAAAAAAAAj9e0WQEAAACl/enfDTr///////'
  )
})

test('packs mp3 files', function(t) {
  t.plan(1)
  t.equal(
    pack(testMp3).slice(0,150)
  , 'data:audio/mp3;base64,//uQxAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAAZAAAX5gALCwseHh4eKioqKjg4ODhDQ0NDTU1NTVZWVlZfX19faWlpaXJycnJ7e3t7hYWFhY6Ojo6Xl5eXoaGh'
  )
})

test('packs jpg files', function(t) {
  t.plan(1)
  t.equal(
    pack(testJpg).slice(0,150)
  , 'data:image/jpg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEB'
  )
})
