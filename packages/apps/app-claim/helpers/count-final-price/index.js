import { multiply, add, bignumber } from 'mathjs'

export default ({ items }) => {
  if (!items) { return 0 }
  return items.reduce((sum, item) => {
    return add(bignumber(sum), multiply(bignumber(Number(item.balanceFormatted)), bignumber(Number(item.price))))
  }, 0)
}
