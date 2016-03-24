var assert = require('assert');

var nm = require('../index')

var cache = {}

describe('NetworkManager', function () {

  describe('create instance', function () {

    it('should return an instance of dbus NetworkManager', function (done) {
      nm.getNetworkManager(function (err, networkManager) {
        assert.equal(!err, true)
        cache.networkManager = networkManager
        done()
      })
    })

    it('should return all properties for the NetworkManager', function (done) {
      cache.networkManager
        .as(nm.interfaces.Properties)
        .GetAll(nm.interfaces.NetworkManager, function (err, list) {

          err && console.error(err);
          assert.equal(!err, true)

          assert.equal(typeof list === 'object', true)
          cache.networkManager.properties = list

          done()
        })
    });

  });

  describe('load device', function () {

    it('should load devices', function (done) {
      cache.networkManager.as(nm.interfaces.NetworkManager).GetDevices(function (err, devices) {

        err && console.error(err)
        assert.equal(!err, true)

        cache.devices = devices
        done()
      })
    })

    it('should load a device by object path', function (done) {

      var devicePath = cache.devices.pop()
      nm.getObject(devicePath, function (err, device) {
        assert.equal(!err, true)
        cache.device = device
        done()
      })

    });

  });

});
