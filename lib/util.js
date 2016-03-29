var util = exports

/**
 * Batch load objects by path
 */
util.getObjects = function (paths, fn) {

  if(!(paths instanceof Array)) {
    return util.getObjects([paths], fn)
  }

  var nm = require('../index')
  util.listRun(paths, function (path, next) {
    nm.getObject(path, next)
  }, fn)
}

/**
 * Batch load properties out of object(s)
 *
 * @params {string} interface to load
 * @params {array} object(s) to load properties from
 * @params {function} callback to call on complete
 * @params {number} load properties recursively untill specified depth, default to 0
 * @params {boolean} reuse loaded objects or issue a new call to dbus each time
 */

util.GetAllProperties = function (iface, objs, onComplete, depth, refresh) {

  depth = depth === undefined ? 0 : depth;
  depth = depth === true ? 1 : depth === false ? 0 : depth
  depth = parseInt(depth) === NaN ? 0 : depth

  if(!(objs instanceof Array)) {
    return util.GetAllProperties(iface, [objs], onComplete, depth, refresh)
  }

  if(depth === 0) {
    return onComplete(null, objs)
  }

  var nm = require('../index')
  util.listRun(objs, function (obj, nextObj) {

    if(!obj.as(nm.interfaces.Properties)) {
      return nextObj(null, {})
    }

    obj.as(nm.interfaces.Properties)
      .GetAll(iface, function (err, props) {

        if(err) {
          return nextObj(err, props)
        }

        var mappedProps = Object.keys(props).filter(function (key) {
          return nm.enums.mapping[iface] &&
            nm.enums.mapping[iface][key] &&
            nm.enums.mapping[iface][key].iface
        })

        if(mappedProps.length === 0) {
          nextObj(err, obj.properties.get())
        }

        util.listRun(mappedProps, function (key, nextProperty) {

          var val = props[key]
          var _isarray = val instanceof Array
          var paths = _isarray ? val : [val]

          var ref = nm.enums.mapping[iface][key]

          util.getObjects(paths, function (err1, childObjs) {

              if(err1) {
                return nextProperty(err1)
              }

              util.GetAllProperties(ref.iface, childObjs, function (err) {

                if(err) {
                  return nextProperty(err)
                }

                var objProps = obj.properties.get(iface)

                if(childObjs && childObjs.length) {
                  objProps[key] = _isarray ? childObjs.map(function (o) {
                    return o.properties.get(ref.iface)
                  }) : childObjs[0].properties.get(ref.iface)
                }
                obj.properties.set(iface, objProps)

                nextProperty()
              }, (depth - 1), false)

            }) //getObjects

        }, function (err, list) {
          nextObj(err, obj)
        })

      }, refresh === undefined ? false : refresh)

  }, onComplete)
}

util.listRun = function (list, onRecord, onComplete) {

  var results = [],
    errors = [];
  var len = list.length,
    cnt = 0;

  if(!list || list.length === 0) {
    return onComplete(null, list)
  }

  var next = function (err, result) {

    if(err) {
      errors.push(err)
    }

    if(result) {
      results.push(result)
    }

    cnt++
    if(cnt === len) {
      onComplete(errors.length ? errors : null, results)
    }
  }

  while(list.length) {
    onRecord(list.pop(), next)
  }
}

/**
 * Monkey patch an object method.
 * `fn` should return a function to handle the call args
 */
util.extendMethod = function (obj, method, fn) {
  var tmpImpl = obj[method].bind(obj)
  obj[method] = fn(tmpImpl)
}

/**
 * Create an Error out of dbus lib error response
 * or ignore if empty
 */
util.createError = function (err) {
  if(err instanceof Error) {
    return err;
  }
  if(err === null || err === undefined) {
    return null;
  }
  err = err instanceof Array && err.length === 1 ? err[0] : err;
  return new Error(err);
}


var _plugins = null;
/**
 * Extend objects matching a regexp on path or interface.
 */
util.applyPlugin = function (path, proxy, obj) {
  var nm = require('../index');
  if(_plugins === null) {
    _plugins = [];
    Object.keys(nm.plugins).map(function (matchpath) {
      _plugins.push({
        regexp: new RegExp(
          '^' + matchpath.replace(/\//g, '.').replace(/\*/g, '.*') + '$', 'i'),
        handler: nm.plugins[matchpath],
      });
    })
  }

  _plugins.forEach(function (plugin) {
    if(path.match(plugin.regexp)) {
      plugin.handler(proxy, obj)
    }
  })

}
