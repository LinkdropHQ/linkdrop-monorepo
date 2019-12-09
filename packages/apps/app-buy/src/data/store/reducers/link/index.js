import reducers from './reducers'
import { getHashVariables } from '@linkdrop/commons'
const ls = window.localStorage
const link = ls && ls.getItem('link')
const minifiedLink = ls && ls.getItem('minifiedLink')

const initialState = {
  loading: false,
  link: link || null,
  // link: link || "http://localhost:9002/#/receive?token=0x0000000000000000000000000000000000000000&nft=0x0000000000000000000000000000000000000000&feeToken=0x0000000000000000000000000000000000000000&feeReceiver=0x0000000000000000000000000000000000000000&linkKey=0xe1793ac83cecdf22541901f68da3c78ee14864f99662e2c7665b2b980c2520ec&nativeTokensAmount=146800000000000000&tokensAmount=0&tokenId=0&feeAmount=0&expiration=11111111111&signerSignature=0xba3fc2cf6a2b095ce10d1674d73aadf1a2a8b58dcf96c749b7d87b8e8e807f5a66d20acbd4ffca9e821b62d2f25d20e920fbebddef324068bc13322dafa597ad1c&linkdropContract=0x7afbc5eb5c2cbece311f3e2edcbe9d0d40ce707a&sender=0x8f21bC2C3c0ee917Dd5259765eb2dE8CE20F0808&chainId=3",
  page: link ? 'finished' : 'process',
  minifiedLink: minifiedLink || null,
  immediateClaim: Boolean(link)
}

export default (state = initialState, action = {}) => {
  const newState = { ...state }
  const { type } = action
  const actionMethod = ACTIONS[type]
  if (!actionMethod) return newState

  return actionMethod(newState, action)
}

const ACTIONS = {
  'LINK.SET_LOADING': reducers.setLoading,
  'LINK.SET_LINK': reducers.setLink,
  'LINK.SET_PAGE': reducers.setPage,
  'LINK.SET_MINIFIED_LINK': reducers.setMinifiedLink
}

// const initialState = {
//   loading: false,
//   link: decodeURIComponent(link) || null,
//   // link: link || "http://localhost:9002/#/receive?token=0x0000000000000000000000000000000000000000&nft=0x0000000000000000000000000000000000000000&feeToken=0x0000000000000000000000000000000000000000&feeReceiver=0x0000000000000000000000000000000000000000&linkKey=0xe1793ac83cecdf22541901f68da3c78ee14864f99662e2c7665b2b980c2520ec&nativeTokensAmount=146800000000000000&tokensAmount=0&tokenId=0&feeAmount=0&expiration=11111111111&signerSignature=0xba3fc2cf6a2b095ce10d1674d73aadf1a2a8b58dcf96c749b7d87b8e8e807f5a66d20acbd4ffca9e821b62d2f25d20e920fbebddef324068bc13322dafa597ad1c&linkdropContract=0x7afbc5eb5c2cbece311f3e2edcbe9d0d40ce707a&sender=0x8f21bC2C3c0ee917Dd5259765eb2dE8CE20F0808&chainId=3",
//   page: 'process',
//   minifiedLink: null,
//   immediateClaim: Boolean(link)
// }