
var dbus = require('dbus-native');
var enums = require('./enums')

var dbusInterfaces = {
  'DBusProperties': 'org.freedesktop.DBus.Properties'
}

exports.enums = enums

var networkManagerPath = "/org/freedesktop/NetworkManager"
exports.path = networkManagerPath

var clients = {
  session: null,
  system: null,
}
var getInterface = function(iface, path, serviceName, fn) {

  clients.system = clients.system || dbus.systemBus();

  if(typeof serviceName === 'function') {
    fn = serviceName
    serviceName = iface
  }

  clients.system.getService(serviceName).getInterface(path, iface, fn)
}
exports.getInterface = getInterface

var getNetworkManager = function(then) {
  getInterface(enums.interfaces.NetworkManager, networkManagerPath, function(err, manager) {
    if(err) return then && then(err, null)
    then && then(null, manager)
  })
}
exports.getNetworkManager = getNetworkManager

var getByPath = function(dInterface, dPath, gInterface, then) {

  if(typeof gInterface === 'function') {
    then = gInterface
    gInterface = enums.interfaces.NetworkManager
  }

  if(enums.interfaces[ dInterface ]) {
    dInterface = enums.interfaces[ dInterface ]
  }

  getInterface(dInterface, dPath, gInterface, then)
}

exports.getByPath = getByPath

var getDeviceByPath = function(devicePath, then) {
  getByPath(enums.interfaces.Device, devicePath, then)
}
exports.getDeviceByPath = getDeviceByPath

exports.getDevices = function(then) {
  getNetworkManager(function(err, networkManager) {

    if(err) return then && then(err)

    // console.dir(networkManager)

    var deviceList = []
    networkManager.GetDevices(function(err, devices) {

      if(err) return then && then(err)

      var len = devices.length, cnt = 0
      devices.forEach(function(devPath) {

        getDeviceByPath(devPath, function(err, device) {

          if(err) return then && then(err)

          GetAllProperties(enums.interfaces.Device, devPath, function(err, props) {
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

var GetAllProperties = function(propIface, path, iface, then) {

  if(typeof path === 'function') {
    then = path
    path = null
  }
  if(typeof iface === 'function') {
    then = iface
    iface = null
  }

  getInterface(
    'org.freedesktop.DBus.Properties',
    path || networkManagerPath,
    iface || enums.interfaces.NetworkManager,
    function(err, props) {

      if(err) return then && then(err, null);

      props.GetAll(propIface, function(err, list) {

        if(err) return then && then(err, null);

        var propsList = {}
        list.forEach(function(pgroup) {

          var addRawValue = false
          var val = pgroup[1][1]

          var key = pgroup[0]

          if(val.length === 1) {
            val = val[0]
          }

          // copy value to retain the original value
          var srcval = (val instanceof Array || typeof val === 'object') ?
              JSON.parse(JSON.stringify( val )) : val

          var ref = enums.mapping[ propIface ][ key ]
          if(ref && enums[ ref ]) {
            if(val instanceof Array) {
              addRawValue = true
              val = val.map(function(ival) {
                return enums[ ref ][ ival ] || enums[ ref ][ ival.toString() ]
              })
            }
            else {
              if(enums[ ref ][ val ]) {
                addRawValue = true
                val = enums[ ref ][ val ]
              }
            }
          }

          if(addRawValue) {
            propsList._raw = propsList._raw || {}
            propsList._raw[key] = srcval
          }

          propsList[ key ] = val
        })

        then && then(null, propsList)
      })
  })
}
exports.GetAllProperties = GetAllProperties
