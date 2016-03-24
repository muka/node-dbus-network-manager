var dbus = require('dbus-native');

var nm = exports

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

var createError = function (err) {
  if(err instanceof Error) {
    return err;
  }
  if(err === null || err === undefined) {
    return null;
  }
  err = err instanceof Array && err.length === 1 ? err[0] : err;
  return new Error(err);
}
nm.createError = createError

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

var _plugins = null;
var applyPlugin = function (path, obj) {

  if(_plugins === null) {
    _plugins = [];
    Object.keys(nm.plugins).map(function (matchpath) {
      _plugins.push({
        regexp: new RegExp(matchpath.replace(/\//g, '.').replace(/\*/g, '.*'), 'i'),
        handler: nm.plugins[matchpath],
      });
    })
  }

  _plugins.forEach(function (plugin) {
    if(path.match(plugin.regexp)) {
      plugin.handler(obj)
    }
  })

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
      applyPlugin(path, obj)

      var _as = obj.as.bind(obj)
      obj.as = function(iface) {
        // apply plugin by interface
        var proxy = _as(iface)
        applyPlugin(iface, proxy)
        return proxy
      }

      fn(createError(err), obj)
    })

}

nm.getNetworkManager = function (then) {
  nm.getObject(nm.paths.NetworkManager, then)
}
