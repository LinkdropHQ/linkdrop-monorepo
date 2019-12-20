export default ({ defaultWallet }) => {
  if (defaultWallet === 'fortmatic') { return ['Fortmatic', 'MetaMask', 'Network'] }
  if (defaultWallet === 'portis') { return ['Portis', 'MetaMask', 'Network'] }
  return ['MetaMask', 'Network']
}
