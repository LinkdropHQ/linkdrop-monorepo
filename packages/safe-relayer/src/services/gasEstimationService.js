import relayerWalletService from './relayerWalletService'
import GnosisSafe from '@gnosis.pm/safe-contracts/build/contracts/GnosisSafe'
import { ethers } from 'ethers'
import sdkService from './sdkService'
import logger from '../utils/logger'
import { FIFSRegistrar } from '@ensdomains/ens'

class GasEstimationService {
  constructor () {}

  async getSafeTxGasEstimate ({ safe, to, value, data, operation }) {
    //
    safe = new ethers.Contract(
      safe,
      GnosisSafe.abi,
      relayerWalletService.provider
    )
    console.log('safe: ', safe)
  }
}

const main = async () => {
  const gasEstimationService = new GasEstimationService()

  let safe = '0x04a6d625663f5ec0c79cd739d1de4a830a8a4965'
  const to = '0xA208969D8F9E443E2B497540d069a5d1a6878f4E'
  const value = 0
  const operation = 0
  const label = ethers.utils.keccak256(ethers.utils.toUtf8Bytes('name'))

  const registerEnsData = sdkService.walletSDK.encodeParams(
    FIFSRegistrar.abi,
    'register',
    [label, safe]
  )
  logger.debug(`registerEnsData: ${registerEnsData}`)
  const data = registerEnsData

  const estimateData = sdkService.walletSDK.encodeParams(
    GnosisSafe.abi,
    'requiredTxGas',
    [to, value, data, operation]
  )
  console.log('estimateData: ', estimateData)

  const safeContract = new ethers.Contract(
    safe,
    GnosisSafe.abi,
    relayerWalletService.wallet
  )
  console.log('safeContract: ', safeContract)

  const modules = await safeContract.getModules()
  console.log('modules: ', modules)

  // const estimatedResponse = await relayerWalletService.provider.call({
  //   from: safe,
  //   to: safe,
  //   value,
  //   data: estimateData,
  //   gasPrice: 0
  // })

  // console.log('estimatedResponse: ', estimatedResponse)
}

main()
