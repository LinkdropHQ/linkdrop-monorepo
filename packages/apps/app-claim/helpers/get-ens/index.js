export default ({ email = '', chainId = '1' }) => {
  const domain = chainId === '1' ? 'eth2phone.eth' : 'linkdrop.test'
  return email.slice(0, email.indexOf('@')).replace('.', '-') + `.${domain}`
}
