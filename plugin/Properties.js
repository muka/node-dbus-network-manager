var cache = require('../lib/cache')
var util = require('../lib/util')
var nm = require('../index')
var Promise = require('bluebird')

module.exports = function (properties, obj) {

  var propsCache = {}

  var GetAll = properties.GetAll
  properties.GetAll = function (iface, fn, refresh) {

    refresh = refresh === undefined ? false : refresh

    if(!iface || typeof iface !== 'string') {
      return fn(new Error("Properties.GetAll requires an interface"))
    }

    var _c = propsCache[iface]
    if(!refresh && _c) {
      return fn(null, _c)
    }

    GetAll(iface, function (err, list) {

      if(err) {
        return fn(err)
      }

      propsCache[iface] = propsCache[iface] || {}
      propsCache[iface] = mapProperties(list, iface)

      fn(null, propsCache[iface])
    })
  }

  obj.getAllProperties = function (iface, refresh) {
    return new Promise(function (resolve, reject) {
      properties.GetAll(iface, function (err, srcProps) {
        if(err) {
          return reject(util.createError(err))
        }
        resolve(JSON.parse(JSON.stringify(srcProps)))
      }, refresh);
    });
  };

  obj.getProperties = function (iface, depth, refresh) {

    depth = depth === undefined ? 0 : depth;
    depth = depth === true ? 1 : depth === false ? 0 : depth
    depth = parseInt(depth) === NaN ? 0 : depth

    return obj.getAllProperties(iface, refresh).then(function (props) {

      if(depth === 0) {
        return Promise.resolve(props)
      }

      var mappedProps = Object.keys(props).filter(function (key) {
        return nm.enums.mapping[iface] &&
          nm.enums.mapping[iface][key] &&
          nm.enums.mapping[iface][key].iface
      })

      if(!mappedProps.length) {
        return Promise.resolve(props)
      }

      return Promise.all(mappedProps).each(function (key) {
          var val = props[key];
          var _isarray = val instanceof Array;
          var paths = _isarray ? val : [val];
          var ref = nm.enums.mapping[iface][key];
          if(!paths.length || paths[0] === '/') {
            return Promise.resolve();
          }
          return nm.getObjects(paths)
            .map(function (childObj) {
              return childObj
                .getProperties(ref.iface, (depth - 1), refresh)
                .then(function (childProps) {
                  if(childProps) {
                    props[key] = childProps
                  }
                  return Promise.resolve(childProps)
                })
            })
        })
        .then(function () {
          return Promise.resolve(props)
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

    var mapconf = enums.mapping[propIface] && enums.mapping[propIface][key] ? enums.mapping[propIface][key] : false
    if(mapconf) {

      var applyValue = function (val) {

        var ref = mapconf.property || mapconf
        if(typeof ref === 'string' && enums[ref][val]) {
          return enums[ref][val] || enums[ref][val.toString()]
        }

        ref = mapconf.handler || mapconf
        if(typeof ref === 'function') {
          return ref(val)
        }

        return val
      }

      val = (function(val) {

        addRawValue = true

        if(mapconf.mapper) {
          return mapconf.mapper(val)
        }

        if(val instanceof Array) {
          return val.map(function (ival) {
            return applyValue(ival)
          })
        }

        return applyValue(val)

      })(val)

    }

    if(addRawValue) {
      propsList._raw = propsList._raw || {}
      propsList._raw[key] = srcval
    }

    propsList[key] = val
  })

  return propsList
}
