var dbus = require('dbus-native');

var enums = require('./enums')
exports.enums = enums

exports.plugins = {
  'org.freedesktop.NetworkManager': require('./plugin/NetworkManager')
}

var dbusInterfaces = {
  'DBusProperties': 'org.freedesktop.DBus.Properties',
  'DBusObjectManager': 'org.freedesktop.DBus.ObjectManager',
}

var createError = function (err) {
  if(err instanceof Error) return err
  err = err instanceof Array && err.length === 1 ? err[0] : err
  return new Error(err)
}

var clients = {
  session: null,
  system: null,
}
var getInterface = function (path, iface, serviceName, fn) {

  clients.system = clients.system || dbus.systemBus();

  iface = enums.getInterface(iface, false)
  path = enums.getPath(path, false)

  if(typeof serviceName === 'function') {
    fn = serviceName
    serviceName = iface
  } else {
    if(enums.interfaces[serviceName]) {
      serviceName = enums.getInterface(serviceName, false)
    }
  }

  clients.system.getService(serviceName).getInterface(path, iface, function (err, res) {

    if(err) {
      return fn(createError(err), null)
    }

    // allow external plugin to extend the object by interface
    if(!exports.plugins[iface]) {
      return fn(null, res)
    }

    var onComplete = function () {
        fn(null, res)
      }
      // * Return `true` to make the call async
    var waitCallback = exports.plugins[iface](res, onComplete)
    if(!waitCallback) {
      onComplete()
    }

  })
}
exports.getInterface = getInterface

var getByPath = function (dInterface, dPath, gInterface, then) {

  if(typeof gInterface === 'function') {
    then = gInterface
    gInterface = null
  }

  if(typeof dPath === 'function') {
    then = dPath
    dPath = null
  }

  getInterface(
    dPath || enums.paths.NetworkManager,
    dInterface,
    gInterface || enums.interfaces.NetworkManager,
    then
  )
}
exports.getByPath = getByPath

var getNetworkManager = function (then) {
  getByPath('NetworkManager', function (err, manager) {
    if(err) return then && then(err, null)
    then && then(null, manager)
  })
}
exports.getNetworkManager = getNetworkManager

var getDeviceByPath = function (devicePath, then) {
  getByPath('Device', devicePath, then)
}
exports.getDeviceByPath = getDeviceByPath

exports.getDevices = function (then) {
  getNetworkManager(function (err, networkManager) {

    if(err) return then && then(err)

    // console.dir(networkManager)

    var deviceList = []
    networkManager.GetDevices(function (err, devices) {

      if(err) return then && then(err)

      var len = devices.length,
        cnt = 0
      devices.forEach(function (devPath) {

        getByPath('Device', devPath, function (err, device) {

          if(err) return then && then(err)

          GetAllProperties(enums.interfaces.Device, devPath, function (err, props) {
            if(err) return then && then(err)
            deviceList.push({
              device: device,
              props: props
            })
            cnt++
            if(cnt === len) {
              then && then(null, deviceList)
            }
          })

        })
      })

    })
  })
}

var GetAllProperties = function (propIface, path, serviceName, then) {

  if(typeof path === 'function') {
    then = path
    path = false
  }
  if(typeof serviceName === 'function') {
    then = serviceName
    serviceName = false
  }

  getInterface(
    path || 'NetworkManager',
    'org.freedesktop.DBus.Properties',
    serviceName || 'NetworkManager',
    function (err, props) {

      if(err) return then && then(err, null);

      propIface = enums.getInterface(propIface, false)

      props.GetAll(propIface, function (err, list) {

        if(err) return then && then(createError(err), null);

        var propsList = {}
        list.forEach(function (pgroup) {

          var addRawValue = false
          var val = pgroup[1][1]

          var key = pgroup[0]

          if(val.length === 1) {
            val = val[0]
          }

          // copy value to retain the original value
          var srcval = (val instanceof Array || typeof val === 'object') ?
            JSON.parse(JSON.stringify(val)) : val

          var ref = enums.mapping[propIface] && enums.mapping[propIface][key] ? enums.mapping[propIface] : false
          if(ref && enums[ref]) {
            if(val instanceof Array) {
              addRawValue = true
              val = val.map(function (ival) {
                return enums[ref][ival] || enums[ref][ival.toString()]
              })
            } else {
              if(enums[ref][val]) {
                addRawValue = true
                val = enums[ref][val]
              }
            }
          }

          if(addRawValue) {
            propsList._raw = propsList._raw || {}
            propsList._raw[key] = srcval
          }

          propsList[key] = val
        })

        then && then(null, propsList)
      })
    })
}
exports.GetAllProperties = GetAllProperties
