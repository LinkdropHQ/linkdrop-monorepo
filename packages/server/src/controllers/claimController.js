import {
  claimServiceERC20,
  claimServiceERC721
} from '../services/claimServices'

export const claim = async (req, res) => {
  // claim transaction
  const txHash = await claimServiceERC20.claim(req.body)

  // return tx hash in successful response
  res.json({
    success: true,
    txHash: txHash
  })
}

export const claimERC721 = async (req, res) => {
  // claim transaction
  const txHash = await claimServiceERC721.claim(req.body)

  // return tx hash in successful response
  res.json({
    success: true,
    txHash: txHash
  })
}

export const claimAndDeploy = async (req, res) => {
  const txHash = await claimServiceERC20.claimAndDeploy(req.body)
  res.json({ success: true, txHash })
}

// GET
export const getStatus = async (req, res) => {
  const linkdropMasterAddress = req.params.linkdropMasterAddress
  const linkId = req.params.linkId

  const status = await claimServiceERC20.getStatus(
    linkdropMasterAddress,
    linkId
  )

  // return status in successful response
  res.send(status)
}

// POST
export const cancel = async (req, res) => {
  const { linkdropMasterAddress, linkId } = req.body

  const claimOperation = await claimServiceERC20.cancel(
    linkdropMasterAddress,
    linkId
  )

  res.json({ success: true, claimOperation })
}
