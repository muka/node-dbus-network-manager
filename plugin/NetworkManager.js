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
        if(loadProperties) {
          fn = function (err, connections) {
            if(err) return fn(util.createError(err))
            util.GetAllProperties(
              nm.interfaces.ConnectionActive,
              connections,
              function(err, props) {
                !err && connections.forEach(function(c, i) {
                  c.properties = props[i]
                })
                fn(err, props)
              },
              loadProperties)
          }
        }
        util.getObjects(connectionsPath, fn)
      })
  }

  /**
   * Return a list of devices
   */
  networkManager.getDevices = function (fn, loadProperties) {
    loadProperties = (loadProperties === undefined) ? false : loadProperties
    networkManager.as(nm.interfaces.NetworkManager)
      .GetDevices(function (err, devicesPath) {
        if(err) {
          return fn(util.createError(err))
        }
        if(loadProperties) {
          fn = function (err, devices) {
            if(err) return fn(util.createError(err))
            util.GetAllProperties(
              nm.interfaces.Device,
              devices,
              fn, loadProperties)
          }
        }
        util.getObjects(devicesPath, fn)
      })
  }

}
