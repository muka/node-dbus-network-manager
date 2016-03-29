
var cache = require('../lib/cache')
var util = require('../lib/util')
var nm = require('../index')

module.exports = function (properties, obj) {

  var propsCache = cache.add(obj.name)

  var GetAll = properties.GetAll
  properties.GetAll = function (iface, fn, refresh) {

    if(!iface || typeof iface !== 'string') {
      return fn(new Error("Properties.GetAll requires an interface"))
    }

    var _c = propsCache.get(iface)
    if(!refresh && _c) {
      return fn(null, _c)
    }

    GetAll(iface, function (err, list) {
      if(err) {
        return fn(err)
      }
      propsCache.set(iface, mapProperties(list, iface))
      fn(null, propsCache.get(iface))
    })
  }

  var loadProperties = function(iface, objs, onComplete, depth, refresh) {

      if(!(objs instanceof Array)) {
        return loadProperties(iface, [objs], onComplete, depth, refresh)
      }

      util.listRun(objs, function (subobj, nextObj) {

        if(!subobj.as(nm.interfaces.Properties)) {
          return nextObj(null, {})
        }

        subobj.getProperties(iface, nextObj, depth, refresh)

      }, onComplete)
  }
  properties.loadProperties = loadProperties
  
  obj.getProperties = function(iface, onComplete, depth, refresh) {

    depth = depth === undefined ? 0 : depth;
    depth = depth === true ? 1 : depth === false ? 0 : depth
    depth = parseInt(depth) === NaN ? 0 : depth

    properties.GetAll(iface, function(err, srcProps) {

      var props = JSON.parse(JSON.stringify(srcProps));

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

        if(!paths.length) {
          return nextProperty();
        }

        util.getObjects(paths, function (err1, childObjs) {

            if(err1) {
              return nextProperty(err1)
            }

            loadProperties(ref.iface, childObjs, function (err, childProps) {

              if(err) {
                return nextProperty(err)
              }

              if(childProps) {
                props[key] = _isarray ? childProps : childProps[0]
                // console.warn(props, val, key, childProps);
                // process.exit()
              }

              nextProperty()
            }, (depth - 1), refresh)

          }) //getObjects

      }, function (err, list) {
        onComplete(err, props)
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
