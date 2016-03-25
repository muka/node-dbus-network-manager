var dbus = require('dbus-native');

var nm = exports

var util = require('./lib/util')
var enums = require('./enums')
nm.enums = enums

nm.plugins = {
  // path
  '/org/freedesktop/NetworkManager': require('./plugin/NetworkManager'),
  '/org/freedesktop/NetworkManager/Device/*': require('./plugin/Device'),
  // interface
  'org.freedesktop.DBus.Properties': require('./plugin/Properties'),
}

nm.interfaces = enums.interfaces
nm.paths = enums.paths

// conn cache
var clients = {
  session: null,
  system: null,
}

/**
 * returns a service connection
 */
nm.getService = function (iface) {
  clients.system = clients.system || dbus.systemBus();
  return clients.system.getService(iface || nm.interfaces.NetworkManager);
}

/**
 * returns a proxy object
 * use obj.as(iface) to get the peratining interface
 */
nm.getObject = function (path, service, fn) {

  if(typeof service === 'function') {
    fn = service
    service = null
  }

  nm
    .getService(service)
    .getObject(path, function (err, obj) {

      // apply plugin by path
      util.applyPlugin(path, obj)

      Object.keys(obj.proxy).forEach(function(iface) {
        util.applyPlugin(iface, obj.as(iface), obj)
      })

      fn(util.createError(err), obj)
    })

}

nm.getNetworkManager = function (then) {
  nm.getObject(nm.paths.NetworkManager, then)
}
