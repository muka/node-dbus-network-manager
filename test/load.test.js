var assert = require('assert');

var netman = require('../index')

var cache = {}

describe('NetworkManager', function() {

  describe('create instance', function () {

    it('should return an instance of dbus NetworkManager', function (done) {
      netman.getNetworkManager(function(err, networkManager) {
        assert.equal( !err, true )
        cache.networkManager = networkManager
        done()
      })
    });

    it('should return all properties for the NetworkManager', function (done) {
      netman.GetAllProperties(netman.enums.interfaces.NetworkManager, function(err, list) {
        // console.dir(list)
        assert.equal( !err, true )
        assert.equal( typeof list === 'object', true )
        done()
      })
    });
  });

  describe('load device', function () {
    it('should load all devices', function (done) {
      netman.getDevices(function(err, devices) {
        assert.equal( !err, true )
        console.dir(devices)
        done()
      })
    })
    it('should load a device by object path', function (done) {

      cache.networkManager.GetDevices(function(err, devices) {
        // console.warn(networkManager);
        assert.equal( !err, true )
        assert.equal( devices.length > 0, true )

        cache.devices = devices

        var devPath = devices.pop()
        netman.getDeviceByPath(devPath, function(err, device) {

          assert.equal( !err, true )

          netman.GetAllProperties(netman.enums.interfaces.Device, devPath, function(err, list) {
            assert.equal( !err, true )
            assert.equal( typeof list === 'object', true )
            done()
          })

        })
      })

    });
  });

});
