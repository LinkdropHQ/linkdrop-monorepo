import { claimServiceERC20, claimServiceERC721 } from '../services/claimServices'

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
