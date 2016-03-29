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

  if(!(objs instanceof Array)) {
    return util.GetAllProperties(iface, [objs], onComplete, depth, refresh)
  }

  var nm = require('../index')
  util.listRun(objs, function (obj, nextObj) {

    if(!obj.as(nm.interfaces.Properties)) {
      return nextObj(null, {})
    }

    obj.getProperties(iface, nextObj, depth, refresh)

  }, onComplete)
}

util.listRun = function (list, onRecord, onComplete) {

  var results = [],
    errors = [];
  var len = list.length,
    cnt = 0;

  if(!list || !list.length) {
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
