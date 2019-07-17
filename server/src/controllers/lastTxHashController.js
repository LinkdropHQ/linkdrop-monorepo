import lastTxHashService from '../services/lastTxHashService'

export const getLastTxHash = async (req, res) => {
  const linkdropMasterAddress = req.params.linkdropMasterAddress
  const linkId = req.params.linkId

  const txHash = await lastTxHashService.getLastTxHash({
    linkdropMasterAddress,
    linkId
  })

  // return tx hash in successful response
  res.json({
    success: true,
    txHash: txHash
  })
}
