/* global MASTER_COPY, INFURA_PK, FACTORY, INITIAL_BLOCK_MAINNET, INITIAL_BLOCK_RINKEBY */

let config

try {
  config = require('../../../configs/app.config.json')
} catch (e) {
  config = {}
}

const masterCopy = MASTER_COPY || String(config.masterCopy)
const factory = FACTORY || String(config.factory)
const initialBlockMainnet = INITIAL_BLOCK_MAINNET || config.initialBlockMainnet
const initialBlockRinkeby = INITIAL_BLOCK_RINKEBY || config.initialBlockRinkeby
const infuraPk = INFURA_PK || String(config.infuraPk)

module.exports = {
  masterCopy,
  factory,
  initialBlockMainnet,
  initialBlockRinkeby,
  infuraPk
}
