import claimService from './claimService'

class LastTxHashService {
  async getLastTxHash ({ linkdropContractAddress, linkId }) {
    const claim = await claimService.findClaimInDB({
      linkId,
      linkdropContractAddress
    })
    const transactions = claim.transactions
    const txHash = transactions[transactions.length - 1].hash
    return txHash
  }

  async getLastTxHashById (id) {
    const claim = await claimService.findClaimById(id)
    const transactions = claim.transactions
    const txHash = transactions[transactions.length - 1].hash
    return txHash
  }
}

export default new LastTxHashService()
