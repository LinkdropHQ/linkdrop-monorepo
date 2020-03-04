import operationService from '../src/services/operationService'
import logger from '../src/utils/logger'
import { ethers } from 'ethers'
import claimService from '../src/services/claimServices/claimServiceERC20'
import connectDB from '../src/models/connectDB'


const getOperationId = () => {
  const args = process.argv.slice(2)
  if (args.length < 1) throw new Error('Please provide operation id')
  return args[0]
}

const getGasPrice = () => {
  const args = process.argv.slice(2)
  let gasPrice = args[1]
  if (args.length < 2) {
    gasPrice = '10'
  }
  return ethers.utils.parseUnits(gasPrice, 'gwei')
}

export const sendTxForOperationId = async operationId => {
  await connectDB()
  const operation = await operationService.findById(operationId)
  logger.json(operation)
  if (!operation) {
    logger.warn(`No such operation found: ${operationId}`)
    throw new Error(`No such operation found: ${operationId}`)
  }
  const params = operation.data

  // Make sure all arguments are passed
  claimService._checkClaimParams(params)

  // blockhain check that params are valid
  await claimService._checkParamsWithBlockchainCall(params)
  logger.debug('Blockchain params check passed. Submitting claim tx...')

  // send claim transaction to blockchain
  const tx = await claimService._sendClaimTx(params)
  logger.info('Submitted claim tx: ' + tx.hash)

  // add transaction details to database
  await operationService.addTransaction(operationId, tx)

  return tx.hash
}

sendTxForOperationId(getOperationId())
