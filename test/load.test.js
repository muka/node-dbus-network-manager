var assert = require('assert');

var netman = require('../index')

var cache = {}

describe('NetworkManager', function () {

  describe('create instance', function () {

    it('should return an instance of dbus NetworkManager', function (done) {
      netman.getInterface('NetworkManager', 'NetworkManager', function (err, networkManager) {

        err && console.error(err)
        assert.equal(!err, true)

        cache.networkManager = networkManager
        done()
      })
    });

    it('should return all properties for the NetworkManager', function (done) {
      netman.GetAllProperties('NetworkManager', function(err, list) {

        err && console.error(err);
        assert.equal( !err, true )

        assert.equal( typeof list === 'object', true )
        // console.dir(list)

        done()
      })
    });

  });

  describe('load device', function () {
    it('should load all devices', function (done) {
      netman.getDevices(function(err, devices) {
        assert.equal( !err, true )
        // console.log(require('util').inspect(devices, { depth: null }));
        done()
      })
    })
    it('should load a device by object path', function (done) {

      cache.networkManager.GetDevices(function(err, devices) {
        // console.warn(networkManager);
        assert.equal( !err, true )
        assert.equal( devices.length > 0, true )

        // cache.devices = devices

        var devPath = devices.pop()
        netman.getDeviceByPath(devPath, function(err, device) {

          assert.equal( !err, true )
          netman.GetAllProperties(netman.enums.interfaces.Device, devPath, function(err, list) {
            assert.equal( !err, true )
            assert.equal( typeof list === 'object', true )
            cache.device = {
              obj: device,
              props: list,
            }
            done()
          })

        })
      })

    });

  });

  describe('load config', function () {
    it('should load IP4Config configuration', function (done) {
      netman.getByPath('IP4Config', cache.device.props.Ip4Config, function(err, res) {

        err && console.error(err)
        assert.equal( !err, true )

        netman.GetAllProperties('IP4Config', cache.device.props.Ip4Config, function(err, list) {

          err && console.error(err)
          assert.equal( !err, true )

          console.log(require('util').inspect(list, { hidden: true, depth: null }));
          done()
        })
      })
    })
  })

});
