var util = exports

var Promise = require('bluebird')

/**
 * transform an array based structure to an object
 */
util.bodyToObject = function(body, output) {

  output = output || {}

  if(!(body instanceof Array)) {
    return output
  }

  body.forEach(function(box) {

    var field = box[0]
    var content = box[1]

    // console.warn('field', field);
    // console.warn('content', content);

    // [ [ { type: 'a', child: [Object] } ], [ [] ] ]
    if(!content) return output

    if(content[0] && content[0][0] && content[0][0].type) {

      var contentDef = content[0][0];
      var contentVal = content[1][0];

      // console.warn('handle content for ', field,'=', contentVal);
      // console.warn('++++', require('util').inspect(contentVal, { depth: null }))
      if(contentVal instanceof Array && contentVal[0] && contentVal[0]) {
        // console.warn('xxxx', require('util').inspect(contentVal[0], { depth: null }))
        contentVal = util.bodyToObject(contentVal[0])
      }

      // convert Buffer
      if(contentVal.type && contentVal.type === 'Buffer') {
        contentVal = contentVal.data.map(function(code) {
          return code.toString(16)
        })
        // .join(':')
      }

      output[field] = contentVal

      return output
    }

    output[field] = {}
    util.bodyToObject(content, output[field])
  })

  return output
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
