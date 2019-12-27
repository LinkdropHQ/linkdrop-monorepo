/* global MASTER_COPY, PORTIS_DAPP_ID, FORMATIC_API_KEY_TESTNET, FORMATIC_API_KEY_MAINNET, JSON_RPC_URL_XDAI, INFURA_PK, FACTORY, CLAIM_HOST */
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
const jsonRpcUrlXdai = JSON_RPC_URL_XDAI || String(config.jsonRpcUrlXdai)
const portisDappId = PORTIS_DAPP_ID || String(config.portisDappId)
const formaticApiKeyTestnet = FORMATIC_API_KEY_TESTNET || String(config.formaticApiKeyTestnetDashboard)
const formaticApiKeyMainnet = FORMATIC_API_KEY_MAINNET || String(config.formaticApiKeyMainnetDashboard)
const linksLimit = config.linksLimit || 1000

module.exports = {
  claimHost,
  masterCopy,
  factory,
  infuraPk,
  jsonRpcUrlXdai,
  portisDappId,
  formaticApiKeyTestnet,
  formaticApiKeyMainnet,
  linksLimit
}
