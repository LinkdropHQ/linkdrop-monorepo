import operationService from '../src/services/operationService'
import lastTxHashService from '../src/services/lastTxHashService'
import connectDB from '../config/db'
import logger from '../src/utils/logger'
import { ethers } from 'ethers'

const getTxHash = () => {
  const args = process.argv.slice(2)
  if (args.length < 1) throw new Error('Please provide tx hash')
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

export const retryTransactionByTxHash = async (txHash, gasPrice) => {
  await connectDB()
  const operation = await operationService.findByTxHash(txHash)
  logger.json(operation)
  const lastTxHash = await lastTxHashService.getLastTxHashById(operation.id)
  operationService.retryTransaction(operation.id, lastTxHash, gasPrice)
}

retryTransactionByTxHash(getTxHash(), getGasPrice())
