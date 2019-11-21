/* global MASTER_COPY, DEFAULT_CHAIN_ID, JSON_RPC_URL_XDAI, INFURA_PK, FACTORY */

let config

try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const masterCopy = MASTER_COPY || String(config.masterCopy)
const factory = FACTORY || String(config.factory)
const infuraPk = INFURA_PK || String(config.infuraPk)
const jsonRpcUrlXdai = JSON_RPC_URL_XDAI || String(config.jsonRpcUrlXdai)
const defaultChainId = DEFAULT_CHAIN_ID || '4'

module.exports = {
  masterCopy,
  jsonRpcUrlXdai,
  factory,
  defaultChainId,
  infuraPk
}
