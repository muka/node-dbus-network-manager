
var cache = require('../lib/cache')

module.exports = function (properties, obj) {

  obj.properties = cache.add(obj.name)

  var GetAll = properties.GetAll
  properties.GetAll = function (iface, fn, refresh) {

    if(!iface || typeof iface !== 'string') {
      return fn(new Error("Properties.GetAll requires an interface"))
    }

    var _c = obj.properties.get(iface)
    if(!refresh && _c) {
      return fn(null, _c)
    }

    GetAll(iface, function (err, list) {
      if(err) {
        return fn(err)
      }
      obj.properties.set(iface, mapProperties(list, iface))
      fn(null, obj.properties.get(iface))
    })
  }

  obj.getProperties = function(iface, fn, depth, refresh) {
    require('../lib/util').GetAllProperties(iface, obj, function(err, props) {
      if(err) {
        return fn(err[0])
      }
      fn(null, props[0])
    }, depth === undefined ? 0 : depth, refresh === undefined ? false : refresh)
  }

}

var mapProperties = function (list, propIface) {
  var enums = require('../index').enums
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

    var ref = enums.mapping[propIface] && enums.mapping[propIface][key] ? enums.mapping[propIface][key] : false

    if(ref) {
      ref = ref.property || ref.handler || ref
    }

    var isfn = typeof ref === 'function'

    if(ref && (enums[ref] || isfn)) {

      var applyValue = function (val) {
        if(isfn) {
          return ref(val)
        }
        if(enums[ref][val]) {
          return enums[ref][val] || enums[ref][val.toString()]
        }
        return val
      }

      if(val instanceof Array) {
        addRawValue = true
        val = val.map(function (ival) {
          return applyValue(ival)
        })
      } else {
        addRawValue = true
        val = applyValue(val)
      }
    }

    if(addRawValue) {
      propsList._raw = propsList._raw || {}
      propsList._raw[key] = srcval
    }

    propsList[key] = val
  })

  return propsList
}
