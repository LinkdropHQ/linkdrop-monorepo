import reducers from './reducers'
import { getHashVariables } from '@linkdrop/commons'
const { link } = getHashVariables()

const initialState = {
  loading: false,
  link: link || null,
  // 'http://localhost:9002/#/receive?token=0x0000000000000000000000000000000000000000&nft=0x0000000000000000000000000000000000000000&feeToken=0x0000000000000000000000000000000000000000&feeReceiver=0x0000000000000000000000000000000000000000&linkKey=0x22c9211d30604efa7cc89870c1cfe4b91833302bb23fdbbffb3ddcbabcd4ea24&nativeTokensAmount=147600000000000000&tokensAmount=0&tokenId=0&feeAmount=0&expiration=11111111111&signerSignature=0x830ce06d34543d84f23f63740b129b13cedec40f8acf42bd830b29a7bbe693ec38010891f6925b12035d4dfbd972fd513f8d61c6e38ddff158b0d35c241071ee1c&linkdropContract=0x450ebfc539c198b2f477aa9656872abef4467732&sender=0x2363756054C39E4C2F64CA42d6d70B65D62881c6&chainId=3',
  // page: 'process'
  page: 'process',
  minifiedLink: null,
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
