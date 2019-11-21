/* global MASTER_COPY, CLAIM_HOST, DEFAULT_CHAIN_ID, MOONPAY_API_KEY, JSON_RPC_URL_XDAI, INFURA_PK, FACTORY */

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
const defaultChainId = DEFAULT_CHAIN_ID || '3'
const moonpayApiKey = MOONPAY_API_KEY || String(config.moonpayApiKey)
const claimHost = CLAIM_HOST || String(config.claimHost)

module.exports = {
  masterCopy,
  jsonRpcUrlXdai,
  factory,
  defaultChainId,
  infuraPk,
  moonpayApiKey,
  claimHost
}
