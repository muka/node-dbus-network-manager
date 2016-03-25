var nm = require('../index')
var util = require('../lib/util')

module.exports = function (networkManager) {

  /**
   * Return a list of active connections
   * @params fn callback(err, props)
   * @params loadProperties true|false or int for deep loading
   */
  networkManager.getActiveConnections = function (fn, loadProperties) {
    loadProperties = (loadProperties === undefined) ? false : loadProperties
    networkManager.as(nm.interfaces.NetworkManager)
      .ActiveConnections(function (err, connectionsPath) {
        if(err) return fn(util.createError(err))
        var done = fn;
        if(loadProperties) {
          done = function (err, connections) {
            if(err) return fn(util.createError(err))
            util.GetAllProperties(
              nm.interfaces.ConnectionActive,
              connections,
              fn, (loadProperties > 0 ? loadProperties : 0))
          }
        }
        util.getObjects(connectionsPath, done)
      })
  }

  /**
   * Return a list of devices
   */
  networkManager.getDevices = function (fn, loadProperties) {
    loadProperties = (loadProperties === undefined) ? false : loadProperties
    networkManager.as(nm.interfaces.NetworkManager)
      .GetDevices(function (err, devicesPath) {
        if(err) return fn(util.createError(err))
        var done = fn;
        if(loadProperties) {
          done = function (err, devices) {
            if(err) return fn(util.createError(err))
            util.GetAllProperties(
              nm.interfaces.Device,
              devices,
              fn, (loadProperties > 0 ? loadProperties : 0))
          }
        }
        util.getObjects(devicesPath, done)
      })
  }

}
