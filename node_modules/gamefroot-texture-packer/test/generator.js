var generator = require('../lib/generator');
var expect = require('expect');
var fs = require('fs');

describe('generator', function () {

  describe('getImagesSizes', function () {
    it('should return image sizes', function (done) {
      var FILES = [
        {path: __dirname + '/fixtures/50x50.jpg', width: 50, height: 50},
        {path: __dirname + '/fixtures/100x100.jpg', width: 100, height: 100},
        {path: __dirname + '/fixtures/200x200.jpg', width: 200, height: 200},
        {path: __dirname + '/fixtures/500x500.jpg', width: 500, height: 500}
      ];

      generator.getImagesSizes(FILES, {padding: 0}, function (err, files) {
        expect(err).toBe(null);

        expect(files[0].width).toEqual(50);
        expect(files[0].height).toEqual(50);

        expect(files[1].width).toEqual(100);
        expect(files[1].height).toEqual(100);

        expect(files[2].width).toEqual(200);
        expect(files[2].height).toEqual(200);

        expect(files[3].width).toEqual(500);
        expect(files[3].height).toEqual(500);

        done();
      });
    });
  });

  describe('resizeImages', function (){
    it('should resize images', function ( done ) {
      var FILES = [
        {path: __dirname + '/fixtures/50x50.jpg', width: 50, height: 50},
        {path: __dirname + '/fixtures/100x100.jpg', width: 100, height: 100},
        {path: __dirname + '/fixtures/200x200.jpg', width: 200, height: 200},
        {path: __dirname + '/fixtures/500x500.jpg', width: 500, height: 500}
      ];
      
      var testWidth = 50;
      var testHeight = 50;
      generator.resizeImages(FILES, { resizeWidth:50, resizeHeight:50 }, function ( err, files ){
        expect(err).toBe(null);

        generator.getImagesSizes( files, {padding: 0}, function ( err, files ) {
          expect(err).toBe(null);

          files.forEach( function( file, i ) {
            expect(file.width).toEqual( testWidth );
            expect(file.height).toEqual( testHeight );
          });

          done();
        });
      });
    });
  });

  describe('determineCanvasSize', function () {
    var FILES = [
      {path: __dirname + '/fixtures/500x500.jpg', width: 500, height: 500},
      {path: __dirname + '/fixtures/200x200.jpg', width: 200, height: 200},
      {path: __dirname + '/fixtures/100x100.jpg', width: 100, height: 100},
      {path: __dirname + '/fixtures/50x50.jpg', width: 50, height: 50}
    ];

    it('should return square canvas', function (done) {
      var options = {format:'kiwi', algorithm:'growing-binpacking', square: true, powerOfTwo: false};
      generator.determineCanvasSize(FILES, options, function (err) {
        expect(err).toBe(null);
        expect(options.atlases.length).toEqual(1,"number of groups should be one");
        expect(options.atlases[0].width).toEqual(options.atlases[0].height);

        done();
      });
    });

    it('should return power of two', function (done) {
      var options = {square: false, powerOfTwo: true};
      generator.determineCanvasSize(FILES, options, function (err) {
        expect(err).toBe(null);
        expect(options.atlases.length).toEqual(1, "number of groups should be one");
        expect(options.atlases[0].width).toEqual(1024);
        expect(options.atlases[0].height).toEqual(512);
        done();
      });
    });

    it('should create multiple texture groups', function (done) {
      var options = {square: false, powerOfTwo: false, width:500, height:500};
      generator.determineCanvasSize(FILES, options, function (err) {
        expect(err).toBe(null);
        expect(options.atlases.length).toBeMoreThan(1);
        // TODO check json and image created for each group
        done();
      });
    });

    it('should create limit texture groups', function (done) {
      var options = {square: false, powerOfTwo: false, width:500, height:500, maxAtlases:1};
      generator.determineCanvasSize(FILES, options, function (err) {
        expect(err).toBe(null);
        expect(options.atlases.length).toEqual(1);
        expect(options.excludedFiles.length).toBeMoreThan(0);
        done();
      });
    });

    var FILES_GROUPED = [
      {path: __dirname + '/fixtures/500x500.jpg', width: 500, height: 500, group:0},
      {path: __dirname + '/fixtures/200x200.jpg', width: 200, height: 200, group:0},
      {path: __dirname + '/fixtures/100x100.jpg', width: 100, height: 100, group:0},
      {path: __dirname + '/fixtures/50x50.jpg', width: 50, height: 50, group:0}
    ];

    it('should group images together that have the same group specified', function(done){
      var options = {width:500, height:500};
      generator.determineCanvasSize(FILES_GROUPED, options, function (err){
        expect(err).toBe(null);
        // Because the files must be grouped together and can not all fit
        expect(options.atlases.length).toEqual(0);
        expect(options.excludedFiles.length).toBeMoreThan(0);
        done();
      });
    });

    after(function(){
      try {
        for (var i = 1; i <= 4; i++) {
          fs.unlinkSync(__dirname + '/test-'+i+'.png');
          fs.unlinkSync(__dirname + '/test-'+i+'.json');
        }
      } catch(e){ }
    });
  });

  describe('generateImage', function () {
    var FILES = [
      {path: __dirname + '/fixtures/50x50.jpg', width: 50, height: 50, x: 0, y: 0},
      {path: __dirname + '/fixtures/100x100.jpg', width: 100, height: 100, x: 0, y: 0},
      {path: __dirname + '/fixtures/200x200.jpg', width: 200, height: 200, x: 0, y: 0},
      {path: __dirname + '/fixtures/500x500.jpg', width: 500, height: 500, x: 0, y: 0}
    ];

    it('should generate image file', function (done) {
      var options = {width: 100, height: 100, path: __dirname + '/', name: 'test', padding: 0};
      generator.generateImage(FILES, options, function (err) {
        expect(err).toBe(null);
        expect(fs.existsSync(__dirname + '/test.png')).toExist();
        done();
      });
    });

    after(function(){
      fs.unlinkSync(__dirname + '/test.png');
    });
  });

  describe('generateData', function () {
    var FILES = [
      {path: __dirname + '/fixtures/50x50.jpg', width: 50, height: 50, x: 0, y: 0},
      {path: __dirname + '/fixtures/100x100.jpg', width: 100, height: 100, x: 0, y: 0},
      {path: __dirname + '/fixtures/200x200.jpg', width: 200, height: 200, x: 0, y: 0},
      {path: __dirname + '/fixtures/500x500.jpg', width: 500, height: 500, x: 0, y: 0}
    ];

    it('should generate data file', function (done) {
      var options = {path: __dirname + '/', name: 'test', format: {extension: 'json', template: 'json.template', padding: 0}};
      generator.generateData(FILES, options, function (err) {
        expect(err).toBe(null);
        expect(fs.existsSync(__dirname + '/test.json')).toExist();
        done();
      });
    });

    after(function(){
      fs.unlinkSync(__dirname + '/test.json');
    });
  });
});
