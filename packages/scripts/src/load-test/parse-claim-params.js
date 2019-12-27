import LinkdropSDK from '@linkdrop/sdk'
import path from 'path'
import fastcsv from 'fast-csv'
import fs from 'fs'
import { ethers } from 'ethers'
import { newError, getString, getUrlParams } from '../utils'
import { signReceiverAddress } from '@linkdrop/sdk/src/utils'
ethers.errors.setLogLevel('error')

const receiverAddress = getString('receiverAddress')
const factoryAddress = getString('FACTORY_ADDRESS')
const LINKS_NUMBER = getString('linksNumber')

const claim = async () => {
  try {
    const claims = []
    console.log('Parsing claim params...')
    for (let linkNumber = 1; linkNumber < LINKS_NUMBER; linkNumber++) {
      const {
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        version,
        chainId,
        linkKey,
        linkdropMasterAddress,
        linkdropSignerSignature,
        campaignId
      } = await getUrlParams('erc20', linkNumber)

      console.log(linkNumber)

      const receiverSignature = await signReceiverAddress(
        linkKey,
        receiverAddress
      )

      const linkId = new ethers.Wallet(linkKey).address

      const claim = {
        weiAmount,
        tokenAddress,
        tokenAmount,
        expirationTime,
        version,
        chainId,
        linkId,
        linkdropMasterAddress,
        linkdropSignerSignature,
        receiverAddress,
        receiverSignature,
        factoryAddress,
        campaignId
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
