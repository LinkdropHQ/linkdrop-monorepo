import { put, select } from 'redux-saga/effects'
import { utils } from 'ethers'

const generator = function * ({ payload }) {
  try {
    const { to, amount } = payload
    const sdk = yield select(generator.selectors.sdk)
    const privateKey = yield select(generator.selectors.privateKey)
    const contractAddress = yield select(generator.selectors.contractAddress)
    console.log({ to, amount })
    const amountFormatted = utils.parseEther(String(amount).trim())
    console.log({ amountFormatted, contractAddress })

    const message = {
      from: contractAddress,
      to: to,
      data: '0x',
      value: amountFormatted
    }
    const result = yield sdk.execute(message, privateKey)
    console.log({ result })
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
  sdk: ({ user: { sdk } }) => sdk,
  contractAddress: ({ user: { contractAddress } }) => contractAddress,
  privateKey: ({ user: { privateKey } }) => privateKey,
  chainId: ({ user: { chainId = '1' } }) => chainId
}
