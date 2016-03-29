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

    //   it('should return all properties for the NetworkManager', function (done) {
    //     cache.networkManager
    //       .as(nm.interfaces.Properties)
    //       .GetAll(nm.interfaces.NetworkManager, function (err, list) {
    //
    //         err && console.error(err);
    //         assert.equal(!err, true)
    //
    //         assert.equal(typeof list === 'object', true)
    //         cache.networkManager.properties = list
    //
    //         done()
    //       })
    //   });
    //
    //   it('should list available connections', function (done) {
    //     cache.networkManager
    //       .as(nm.interfaces.NetworkManager)
    //       .ActiveConnections(function (err, conns) {
    //
    //         err && console.error(err);
    //         assert.equal(!err, true)
    //
    //         nm.getObject(conns.pop(), function (err, activeConn) {
    //
    //           err && console.error(err);
    //           assert.equal(!err, true)
    //
    //           // console.log(require('util').inspect(activeConn, { depth: 2 }));
    //
    //           activeConn
    //             .as(nm.interfaces.Properties)
    //             .GetAll(nm.interfaces.ConnectionActive, function (err, props) {
    //
    //               err && console.error(err);
    //               assert.equal(!err, true)
    //
    //               // console.log(require('util').inspect(props, { depth: 2 }));
    //
    //               done()
    //             })
    //
    //         })
    //
    //
    //       })
    //   });

  });

  describe('Device interface', function () {

    // it('should load all devices', function (done) {
    //   cache.networkManager.getDevices(function (err, devices) {
    //
    //     err && console.error(err)
    //     assert.equal(!err, true)
    //
    //     cache.devices = devices
    //     done()
    //   })
    // })

    // it('should load a device properties', function (done) {
    //
    //   var device = cache.devices.pop()
    //   device.getProperties(nm.interfaces.Device, function (err, device) {
    //     assert.equal(!err, true)
    //     cache.device = device
    //     done()
    //   })
    //
    // });

    // it('should load all active connections', function (done) {
    //   cache.networkManager.getActiveConnections(function(err, connections) {
    //     // console.log(require('util').inspect(err, { depth: null }));
    //     assert.equal(!err, true)
    //     assert.equal(connections instanceof Array, true)
    //     // console.log(require('util').inspect(connections, { depth: null }));
    //     done()
    //   }, true)
    // });

    it('should deep-load all active connections', function (done) {

      cache.networkManager.getActiveConnections(function (err, connections) {

        // console.log(require('util').inspect(err, { depth: null }));

        assert.equal(!err, true)
        assert.equal(connections instanceof Array, true)

        // console.log(require('util').inspect(connections.map(function (v) {
        //   return v.properties.get(nm.interfaces.ConnectionActive)
        // }), {
        //   depth: null
        // }));
        done()

      }, 3, false)

    });

  });

});