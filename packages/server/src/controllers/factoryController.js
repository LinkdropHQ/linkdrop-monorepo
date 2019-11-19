import factoryService from '../services/factoryService'

// POST
export const deploy = async (req, res) => {
  // claim transaction
  const txHash = await factoryService.deploy(req.body)

  // return tx hash in successful response
  res.json({
    success: true,
    txHash: txHash
  })
}

// GET
export const isDeployed = async (req, res) => {
  const senderAddress = req.params.senderAddress
  const campaignId = req.params.campaignId
  const isDeployed = await factoryService.isDeployed(senderAddress, campaignId)
  res.json({ success: true, isDeployed })
}
