var assert = require('assert');

var nm = require('../index')
var util = require('../lib/util')
var Promise = nm.Promise

var cache = {}

describe('NetworkManager', function () {


  it('should return an instance of dbus NetworkManager', function () {
    return nm.getNetworkManager()
  })

  it('should return all properties for the NetworkManager', function () {
    return nm.getNetworkManager().then(function (networkManager) {
      return networkManager.getOverview()
    })
  });

  it('should load all devices', function () {
    return nm.getNetworkManager().then(function (networkManager) {
      return networkManager.getDevices()
    })
  })

  it('should load a device properties', function () {
    return nm.getNetworkManager().then(function (networkManager) {
      return networkManager.getDevices().then(function (devices) {
        return devices.pop().getProperties(nm.interfaces.Device)
      })
    })
  });

  it('should load device properties recursively', function () {
    return nm.getNetworkManager().then(function (networkManager) {
      return networkManager.getDevices().each(function (device) {
        return device.getProperties(nm.interfaces.Device, 3)
      })
    })
  });

  it('should load active connections', function () {
    return nm.getNetworkManager().then(function (networkManager) {
      return networkManager.getActiveConnections()
    })
  })

  it('should deep-load properties of the active connections', function () {
    return nm.getNetworkManager().then(function (networkManager) {
      return networkManager.getActiveConnections().each(function (connection) {
        return connection.getProperties(nm.interfaces.ConnectionActive, 3)
      })
    })
  });

  it('should properly list DHCP4Config', function () {
    return nm.getNetworkManager().then(function (networkManager) {
      return networkManager.getOverview()
        .then(function (overview) {
          assert.equal(typeof overview.PrimaryConnection.Dhcp4Config.Options, 'object')
        })
    })
  });

  it('should list available connections', function () {
    return nm.getNetworkManager().then(function (networkManager) {
      return networkManager.getDevices()
        .map(function (device) {
          return device.getAvailableConnections()
        })
        .map(function (conns) {
          if(!conns.length) {
            return Promise.resolve([])
          }
          return Promise.all(conns).map(function (conn) {
            return conn.getSettings()
            // .then(function(c) {
            //   console.log(require('util').inspect(c, { depth: null }));
            // })
          })
        })
    })
  });

});
