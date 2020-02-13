/* global API_HOST, SURVEY_URL */

let config
try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const apiHost = API_HOST || String(config.qrApiHost)
const surveyUrl = SURVEY_URL || String(config.surveyUrl)

module.exports = {
  apiHost,
  surveyUrl
}
