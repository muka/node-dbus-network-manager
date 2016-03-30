
var nm = require('../index')

module.exports = function(device) {

  /**
   * Return a list of available connections
   */
  device.getAvailableConnections = function () {
    return new Promise(function(resolve, reject) {
      device.as(nm.interfaces.Device)
        .AvailableConnections(function (err, conns) {
          if(err) {
            return reject(util.createError(err))
          }
          nm.getObjects(conns)
            .then(resolve)
            .catch(reject)
        })
    })
  }


}
