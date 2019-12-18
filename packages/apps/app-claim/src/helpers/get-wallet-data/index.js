import wallets from 'wallets'

export default ({ wallet }) => wallets[wallet] || {}
