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
          return util.getObjects(connectionsPath)
        })
    })
  }

  /**
   * Return a list of devices
   */
  networkManager.getDevices = function () {
    return new Promise(function(resolve, reject) {
      networkManager.as(nm.interfaces.NetworkManager)
        .GetDevices(function (err, devicesPath) {
          if(err) {
            return reject(util.createError(err))
          }
          return util.getObjects(devicesPath)
        })
    });
  }

  /**
   * Return an overview of the networkManager status
   */
  networkManager.getOverview = function () {
    return new Promise(function(resolve, reject) {
      networkManager.as(nm.interfaces.Properties)
        .GetAll(function (err, props) {
          if(err) {
            return reject(util.createError(err))
          }
          resolve(props)
        })
    });
  }

}
