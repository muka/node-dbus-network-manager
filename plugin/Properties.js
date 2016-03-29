
var cache = require('../lib/cache')
var nm = require('../index')

module.exports = function (properties, obj) {

  var properties = cache.add(obj.name)

  var GetAll = properties.GetAll
  properties.GetAll = function (iface, fn, refresh) {

    if(!iface || typeof iface !== 'string') {
      return fn(new Error("Properties.GetAll requires an interface"))
    }

    var _c = properties.get(iface)
    if(!refresh && _c) {
      return fn(null, _c)
    }

    GetAll(iface, function (err, list) {
      if(err) {
        return fn(err)
      }
      properties.set(iface, mapProperties(list, iface))
      fn(null, properties.get(iface))
    })
  }

  obj.getProperties = function(iface, onComplete, depth, refresh) {

    depth = depth === undefined ? 0 : depth;
    depth = depth === true ? 1 : depth === false ? 0 : depth
    depth = parseInt(depth) === NaN ? 0 : depth

    properties.GetAll(iface, function(err, props) {

      if(err) {
        return onComplete(err)
      }

      if(depth === 0) {
        return onComplete(null, props)
      }

      var mappedProps = Object.keys(props).filter(function (key) {
        return nm.enums.mapping[iface] &&
          nm.enums.mapping[iface][key] &&
          nm.enums.mapping[iface][key].iface
      })

      if(!mappedProps.length) {
        onComplete(err, props)
      }

      util.listRun(mappedProps, function (key, nextProperty) {

        var val = props[key];
        var _isarray = val instanceof Array;
        var paths = _isarray ? val : [val];

        var ref = nm.enums.mapping[iface][key];

        if(val === null) {
          console.warn(props, key, ';;;;;;;;;;;;;;;');
          return nextProperty();
        }

        if(!paths.length) {
          return nextProperty();
        }

        util.getObjects(paths, function (err1, childObjs) {

            if(err1) {
              return nextProperty(err1)
            }

            util.GetAllProperties(ref.iface, childObjs, function (err) {

              if(err) {
                return nextProperty(err)
              }

              var objProps = obj.properties.get(iface)
              console.warn(objProps);
              // if(childObjs && childObjs.length) {
              //   var _propsobj = childObjs.map(function (o) {
              //     console.warn(p.properties.get(ref.iface));
              //     return o.properties.get(ref.iface)
              //   })
              //   console.warn(_propsobj);
              //   objProps[key] = _isarray ? _propsobj : _propsobj[0]
              // }
              // obj.properties.set(iface, objProps)

              nextProperty()
            }, (depth - 1), refresh)

          }) //getObjects

      }, function (err, list) {
        onComplete(err, obj)
      })

    }, refresh)
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
