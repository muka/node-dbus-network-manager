var util = exports


util.getObjects = function(paths) {
  return Promise.all(paths).each(function(path) {
    return require('../index').getObject(path)
  })
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
