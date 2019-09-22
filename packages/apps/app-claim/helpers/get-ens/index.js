import config from 'app.config.js'

export default ({ email = '', chainId = config.defaultChainId }) => {
  const domain = chainId === '1' ? 'eth2phone.eth' : 'linkdrop.test'
  const randomChars = Math.floor(Math.random() * (999 - 100 + 1) + 100)
  return email.slice(0, email.indexOf('@')).replace('.', '-') + `-${randomChars}.${domain}`
}
