
var dbus = require('dbus-native');
var Promise = require('bluebird');
var cache = require('./lib/cache');
var util = require('./lib/util')
var enums = require('./lib/enums')

var nm = exports

nm.enums = enums
nm.Promise = Promise

nm.interfaces = enums.interfaces
nm.paths = enums.paths


nm.plugins = {
  // path
  '/org/freedesktop/NetworkManager': require('./plugin/NetworkManager'),
  '/org/freedesktop/NetworkManager/Device/*': require('./plugin/Device'),
  // interface
  'org.freedesktop.DBus.Properties': require('./plugin/Properties'),
}

// conn cache
var clients = {
  session: null,
  system: null,
}

/**
 * returns a service connection
 */
nm.getService = function (service) {
  service = service || nm.interfaces.NetworkManager
  clients.system = clients.system || dbus.systemBus();
  return clients.system.getService(service);
}

var serviceCache = {}
var getCache = function(service) {
  service = service || nm.interfaces.NetworkManager;
  serviceCache[service] = serviceCache[service] || cache.add(service);
  return serviceCache[service];
}

/**
 * returns a proxy object
 * use obj.as(iface) to get the pertaining interface
 */
nm.getObject = function (path, service) {

  // load cache first
  var obj = getCache(service).get(path)
  if(obj) {
    return Promise.resolve(obj)
  }

  return new Promise(function(resolve, reject) {
    nm
      .getService(service)
      .getObject(path.toString(), function (err, obj) {
        if(err) {
          return reject(util.createError(err))
        }
        // apply plugin by path
        util.applyPlugin(path, obj)
        if(obj && obj.proxy) {
          Object.keys(obj.proxy).forEach(function(iface) {
            util.applyPlugin(iface, obj.as(iface), obj)
          })
        }
        getCache(service).set(path, obj)
        resolve(obj)
      })
  })
}

nm.getObjects = function(paths) {
  return Promise.all(paths).map(function(path) {
    return nm.getObject(path)
  })
}

nm.getNetworkManager = function () {
  return nm.getObject(nm.paths.NetworkManager)
}
