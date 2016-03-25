
var util = exports

/**
 * Batch load objects by path
 */
util.getObjects = function(paths, fn) {
  if(!(paths instanceof Array)) return util.getObjects([paths], fn)
  var nm = require('../index')
  util.listRun(paths, function(path, next) {
    nm.getObject(path, next)
  }, fn)
}

/**
 * Batch load properties out of object(s)
 */
util.GetAllProperties = function(iface, objs, fn, depth, refresh) {

  depth = depth === undefined ? false : depth;
  depth = depth === true ? 0 : depth;

  if(!(objs instanceof Array)) return util.GetAllProperties([objs], fn)
  var nm = require('../index')
  util.listRun(objs, function(obj, next) {

    if(!obj.as(nm.interfaces.Properties)) {
      return next(null, {})
    }

    obj.getProperties(iface, function(err, props) {

      if(err) {
        return next(err, obj)
      }

      // console.warn('depth ', depth);
      if(depth > 0) {

        util.listRun(Object.keys(props), function(key, next1) {

          var val = props[key]
          var _isarray = val instanceof Array
          var paths = _isarray ? val : [val]

          var ref = nm.enums.mapping[iface] && nm.enums.mapping[iface][key]
            ? nm.enums.mapping[iface][key] : null;
          if(ref && ref.iface) {
            // console.warn('paths', paths);
            // console.warn('ref.iface', ref.iface);
            util.getObjects(paths, function(err, s_objs) {
              if(err) {
                 return next1(err)
              }
              util.GetAllProperties(ref.iface, s_objs, function(err, objs) {
                if(objs && objs.length) {
                  obj.properties[key] = _isarray
                    ? objs.map(function(o) { return o.properties }) : objs[0].properties
                }
                next1(err, objs)
              }, depth-1, false)
            })
          }
          else {
            next1(null, props[key])
          }

        }, function(err, list) {
          next(err, obj)
        })

        return
      }

      next(err, obj)
    }, refresh === undefined ? true : refresh)

  }, fn)
}

util.listRun = function (list, onRecord, onComplete) {

  var results = [], errors = []
  var len = list.length,
    cnt = 0

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
util.extendMethod = function(obj, method, fn) {
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
          '^' + matchpath.replace(/\//g, '.').replace(/\*/g, '.*') + '$'
        , 'i'),
        handler: nm.plugins[matchpath],
      });
    })
  }

  _plugins.forEach(function (plugin) {
    if(path.match(plugin.regexp)) {
      // console.warn('*********** match', path, ' --- ' ,plugin.regexp);
      plugin.handler(proxy, obj)
    }
  })

}
