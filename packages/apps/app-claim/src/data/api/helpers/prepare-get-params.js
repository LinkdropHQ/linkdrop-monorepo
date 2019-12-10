export default (params) => {
  const paramsCollected = Object.keys(params).reduce((sum, item) => {
    if (params[item] == null) {
      return sum
    }
    return sum.concat(`${item}=${params[item]}`)
  }, []).join('&')
  return `?${paramsCollected}`
}
