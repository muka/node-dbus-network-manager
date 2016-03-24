
module.exports = function (properties) {

  var GetAll = properties.GetAll
  properties.GetAll = function (propIface, fn) {
    GetAll(propIface, function (err, list) {
      if(err) {
        return fn(err)
      }
      fn(null, mapProperties(list, propIface))
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

    if(ref && enums[ref]) {

      var applyValue = function (val) {
        if(typeof enums[ref][val] === 'function') {
          return enums[ref][val](val)
        }
        return enums[ref][val] || enums[ref][val.toString()]
      }

      if(val instanceof Array) {
        addRawValue = true
        val = val.map(function (ival) {
          return applyValue(ival)
        })
      } else {
        if(enums[ref][val]) {
          addRawValue = true
          val = applyValue(val)
        }
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
