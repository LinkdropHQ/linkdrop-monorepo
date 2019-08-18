export default ({ email = '', chainId = '1' }) => {
  const domain = chainId === '1' ? 'eth2phone.eth' : 'linkdrop.test'
  const randomChars = Math.floor(Math.random() * (999 - 100 + 1) + 100)
  return email.slice(0, email.indexOf('@')).replace('.', '-') + `-${randomChars}.${domain}`
}
