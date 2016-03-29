
var data = {}

var Cache = function(path) {

  var cache = this
  data[path] = data[path] || {}

  cache.set = function (iface, val) {
    data[path][iface] = val;
  }

  cache.get = function (iface) {
    return data[path][iface] || null;
  }

  cache.clear = function (iface) {
    if(data[path]) {
      if(!iface) {
        delete data[path];
        return
      }
      if(data[path][iface]) {
        delete data[path][iface];
      }
    }
  }
}

exports.add = function(path) {
  return new Cache(path)
}
