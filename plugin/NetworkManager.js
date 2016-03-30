var nm = require('../index')
var util = require('../lib/util')
var Promise = require('bluebird')

module.exports = function (networkManager) {

  /**
   * Return a list of active connections
   */
  networkManager.getActiveConnections = function () {
    return new Promise(function(resolve, reject) {
      networkManager.as(nm.interfaces.NetworkManager)
        .ActiveConnections(function (err, connectionsPath) {
          if(err) {
            return reject(util.createError(err))
          }
          nm.getObjects(connectionsPath)
            .then(resolve)
            .catch(reject)
        })
    })
  }

  /**
   * Return a list of devices
   */
  networkManager.getDevices = function () {
    return new Promise(function(resolve, reject) {
      networkManager.as(nm.interfaces.NetworkManager)
        .GetDevices(function (err, devicePaths) {
          if(err) {
            return reject(util.createError(err))
          }

          return nm.getObjects(devicePaths)
            .then(resolve)
            .catch(reject)
        })
    });
  }

  /**
   * Return an overview of the networkManager status
   */
  networkManager.getOverview = function () {
    return networkManager.getProperties(nm.interfaces.NetworkManager, 5)
  }

}
