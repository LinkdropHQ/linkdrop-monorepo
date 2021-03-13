/* global MASTER_COPY, PORTIS_DAPP_ID, FORMATIC_API_KEY_TESTNET, FORMATIC_API_KEY_MAINNET, INFURA_PK, FACTORY, INITIAL_BLOCK_GOERLI, INITIAL_BLOCK_KOVAN, INITIAL_BLOCK_ROPSTEN, INITIAL_BLOCK_MAINNET, INITIAL_BLOCK_RINKEBY */

let config

try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const masterCopy = MASTER_COPY || String(config.masterCopy)
const factory = FACTORY || String(config.FACTORY_ADDRESS)
const initialBlockMainnet = INITIAL_BLOCK_MAINNET || config.initialBlockMainnet || 0
const initialBlockRinkeby = INITIAL_BLOCK_RINKEBY || config.initialBlockRinkeby || 0
const initialBlockGoerli = INITIAL_BLOCK_GOERLI || config.initialBlockGoerli || 0
const initialBlockRopsten = INITIAL_BLOCK_ROPSTEN || config.initialBlockRopsten || 0
const initialBlockKovan = INITIAL_BLOCK_KOVAN || config.initialBlockKovan || 0
const infuraPk = INFURA_PK || String(config.infuraPk)
const portisDappId = PORTIS_DAPP_ID || String(config.portisDappId)
const formaticApiKeyTestnet = FORMATIC_API_KEY_TESTNET || String(config.formaticApiKeyTestnetClaim)
const formaticApiKeyMainnet = FORMATIC_API_KEY_MAINNET || String(config.formaticApiKeyMainnetClaim)

module.exports = {
  masterCopy,
  factory,
  portisDappId,
  formaticApiKeyTestnet,
  formaticApiKeyMainnet,
  initialBlockMainnet,
  initialBlockRinkeby,
  infuraPk,
  initialBlockGoerli,
  initialBlockRopsten,
  initialBlockKovan
}
