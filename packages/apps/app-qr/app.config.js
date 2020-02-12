/* global API_HOST */

let config
try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const apiHost = API_HOST || String(config.apiHost)

module.exports = {
  apiHost
}
