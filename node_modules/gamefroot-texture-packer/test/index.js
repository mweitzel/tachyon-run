var spritesheet = require('..');
var assert = require('assert');
var expect = require('expect');
var fs = require('fs');

var FORMAT = {extension: 'json', template: 'json.template'};

describe('Texture Packing', function () {

  describe('with given pattern of files', function () {
    it('should generate xml file', function (done) {
      spritesheet(__dirname + '/fixtures/*', {name: 'test', path: __dirname, format: FORMAT}, function (err) {
        expect(err).toBe(null);
        expect(fs.existsSync(__dirname + '/test-1.json')).toExist();
        done();
      });
    });

    it('should generate png file', function (done) {
      spritesheet(__dirname + '/fixtures/*', {name: 'test', path: __dirname, format: FORMAT}, function (err) {
        expect(err).toBe(null);
        expect(fs.existsSync(__dirname + '/test-1.png')).toExist();
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

  describe('with given array of files', function () {
    it('should generate xml file', function (done) {
      spritesheet([__dirname + '/fixtures/100x100.jpg'], {name: 'test', path: __dirname, format: FORMAT}, function (err) {
        expect(err).toBe(null);
        expect(fs.existsSync(__dirname + '/test-1.json')).toExist();
        done();
      });
    });

    it('should generate png file', function (done) {
      spritesheet([__dirname + '/fixtures/100x100.jpg'], {name: 'test', path: __dirname, format: FORMAT}, function (err) {
        expect(err).toBe(null);
        expect(fs.existsSync(__dirname + '/test-1.png')).toExist();
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

});

