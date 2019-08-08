export default ({ itemsToClaim }) => {
  if (itemsToClaim.length === 0) { return null }
  const erc20Item = itemsToClaim.find(item => item.type === 'erc20')
  if (erc20Item) { return erc20Item }
  const ethItem = itemsToClaim.find(item => item.type === 'eth')
  if (ethItem) { return ethItem }
}
