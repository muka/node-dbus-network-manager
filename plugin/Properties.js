
module.exports = function (properties, obj) {

  obj.properties = null
  obj.getProperties = function(iface, fn, refresh) {
    if(!refresh && obj.properties !== null) {
      fn(null, obj.properties)
      return
    }
    properties.GetAll(iface, function(err, props) {
      if(props) {
        obj.properties = props
      }
      fn(err, props)
    })
  }

  var GetAll = properties.GetAll
  properties.GetAll = function (iface, fn) {
    if(!iface || typeof iface !== 'string') {
      throw new Error("Properties.GetAll requires an interface")
    }
    GetAll(iface, function (err, list) {
      if(err) {
        return fn(err)
      }
      fn(null, mapProperties(list, iface))
    })
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
