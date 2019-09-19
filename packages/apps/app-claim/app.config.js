/* global MASTER_COPY, INFURA_PK, FACTORY, INITIAL_BLOCK_GOERLI, INITIAL_BLOCK_KOVAN, INITIAL_BLOCK_ROPSTEN, INITIAL_BLOCK_MAINNET, INITIAL_BLOCK_RINKEBY */

let config

try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const masterCopy = MASTER_COPY || String(config.masterCopy)
const factory = FACTORY || String(config.factory)
const initialBlockMainnet = INITIAL_BLOCK_MAINNET || config.initialBlockMainnet || 0
const initialBlockRinkeby = INITIAL_BLOCK_RINKEBY || config.initialBlockRinkeby || 0
const initialBlockGoerli = INITIAL_BLOCK_GOERLI || config.initialBlockGoerli || 0
const initialBlockRopsten = INITIAL_BLOCK_ROPSTEN || config.initialBlockRopsten || 0
const initialBlockKovan = INITIAL_BLOCK_KOVAN || config.initialBlockKovan || 0
const infuraPk = INFURA_PK || String(config.infuraPk)

module.exports = {
  masterCopy,
  factory,
  initialBlockMainnet,
  initialBlockRinkeby,
  infuraPk,
  initialBlockGoerli,
  initialBlockRopsten,
  initialBlockKovan
}
