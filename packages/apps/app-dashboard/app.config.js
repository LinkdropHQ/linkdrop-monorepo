/* global MASTER_COPY, JSON_RPC_URL, INFURA_PK, FACTORY, CLAIM_HOST */
let config

try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const masterCopy = MASTER_COPY || String(config.masterCopy)
const factory = FACTORY || String(config.factory)
const claimHost = CLAIM_HOST || String(config.claimHost)
const infuraPk = INFURA_PK || String(config.infuraPk)
const jsonRpcUrl = JSON_RPC_URL || String(config.jsonRpcUrl)

module.exports = {
  claimHost,
  masterCopy,
  factory,
  infuraPk,
  jsonRpcUrl
}
