export default ({ amount, roundTo = 1000, hideFloat }) => {
  const finalAmount = Math.round((amount || 0) * roundTo) / roundTo
  // если число больше нуля
  if (hideFloat && finalAmount >= 1) {
    // если число не целое - округлить
    if (finalAmount % 1 !== 0) {
      return Math.round(finalAmount)
    } else {
      return finalAmount
    }
  }
  if (finalAmount < 0.001 && finalAmount > 0) { return 0.001 }
  return finalAmount
}
