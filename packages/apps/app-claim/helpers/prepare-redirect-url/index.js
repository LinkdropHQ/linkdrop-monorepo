import { getHashVariables } from '@linkdrop/commons'

export default ({ link }) => {
  const {
    dappId
  } = getHashVariables()
  if (dappId) {
    return `${link}?dappId=${dappId}`
  }
  return link
}
