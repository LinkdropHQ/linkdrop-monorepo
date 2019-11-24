import factoryService from '../services/factoryService'
import linkdropService from '../services/linkdropService'

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

// POST
export const withdraw = async (req, res) => {
  // claim transaction
  const txHash = await linkdropService.withdraw(req.body)

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
