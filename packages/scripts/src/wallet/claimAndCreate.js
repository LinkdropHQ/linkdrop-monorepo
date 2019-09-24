import { WalletSDK } from '../../../sdk/src/index'
import { ethers } from 'ethers'
import { newError, getString, getUrlParams, getLinkNumber } from '../utils'
ethers.errors.setLogLevel('error')

const LINKS_NUMBER = getString('linksNumber')

const claimAndCreate = async () => {
  try {
    const linkNumber = getLinkNumber(LINKS_NUMBER - 1)
    const {
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId
    } = await getUrlParams('eth', linkNumber)

    const walletSDK = new WalletSDK({})
    const owner = ''
    const name = ''

    const { errors, success, txHash } = await walletSDK.claimAndCreate({
      weiAmount,
      tokenAddress,
      tokenAmount,
      expirationTime,
      linkKey,
      linkdropMasterAddress,
      linkdropSignerSignature,
      campaignId,
      owner,
      name
    })

    if (success === true && txHash) {
      console.log('Submitted claimAndCreate transaction')
      console.log(`Tx hash: ${txHash}\n`)
    }
  } catch (err) {
    console.log('Failed to claim and create')
    throw new Error(err)
  }
}

claimAndCreate()
