import LinkdropSDK from '@linkdrop/sdk'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'
import { ethers } from 'ethers'
import { newError, getUrlParams, LinkParams } from '../utils'
import { signReceiverAddress } from '@linkdrop/sdk/src/utils'
import config from '../../config'
ethers.errors.setLogLevel('error')

const { RECEIVER_ADDRESS, FACTORY_ADDRESS, LINKS_NUMBER } = config

const claim = async () => {
  try {
    const claims = []
    console.log('Parsing claim params...')

    for (let linkNumber = 1; linkNumber < LINKS_NUMBER; linkNumber++) {
      const {
        token,
        nft,
        feeToken,
        feeReceiver,
        linkKey,
        nativeTokensAmount,
        tokensAmount,
        tokenId,
        feeAmount,
        expiration,
        data,
        signerSignature,
        linkdropContract,
        sender
      } = await getUrlParams('erc20', linkNumber)

      const receiverSignature = await signReceiverAddress(
        linkKey,
        RECEIVER_ADDRESS
      )

      const linkId = new ethers.Wallet(linkKey).address

      const linkParams = new LinkParams({
        token,
        nft,
        feeToken,
        feeReceiver,
        linkId,
        nativeTokensAmount,
        tokensAmount,
        tokenId,
        feeAmount,
        expiration,
        data
      })

      const claim = {
        linkParams: JSON.stringify(linkParams),
        signerSignature,
        receiverAddress: RECEIVER_ADDRESS,
        receiverSignature,
        linkdropContractAddress: linkdropContract
      }

      claims.push(claim)
    }

    // Save claims
    const dir = path.join(__dirname)
    const filename = path.join(dir, 'claim-params.csv')

    try {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      const ws = fs.createWriteStream(filename)
      fastcsv.write(claims, { headers: true }).pipe(ws)

      console.log(`Successfully saved claim params to ${filename}`)
    } catch (err) {
      throw newError(err)
    }
  } catch (err) {
    throw newError(err)
  }
}

claim()
