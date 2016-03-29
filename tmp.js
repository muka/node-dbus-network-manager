

var nm = require('./index')
nm.getNetworkManager(function(err, networkManager) {

  networkManager.getActiveConnections(function(err, connections) {
    // console.log(require('util').inspect(err, { depth: null }));
    assert.equal(!err, true)
    assert.equal(connections instanceof Array, true)
    // console.log(require('util').inspect(connections, { depth: null }));
    done()
  }, true)

})
