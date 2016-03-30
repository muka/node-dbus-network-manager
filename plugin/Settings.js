
var nm = require('../index')
var util = require('../lib/util')
var Promise = nm.Promise

module.exports = function(setting) {

  setting.getSettings = function() {
    return Promise.promisify(
      setting.as(nm.interfaces.SettingsConnection).GetSettings
    )().then(util.bodyToObject)
  }
  setting.getSecrets = function() {
    return Promise.promisify(
      setting.as(nm.interfaces.SettingsConnection).GetSecrets
    )()
  }

}
