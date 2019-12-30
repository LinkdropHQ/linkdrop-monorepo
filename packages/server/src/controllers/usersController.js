import User from '../models/User'
import { BadRequestError } from '../utils/errors'
import logger from '../utils/logger'

export const create = async (req, res) => {
  const { email, address, data } = req.body

  if (email == null || email === '') {
    throw new BadRequestError('User email should be provided')
  }
  if (address == null || address === '') {
    throw new BadRequestError('User address should be provided')
  }

  const user = new User({ email, address, data })

  logger.debug('Trying to save user to database:')
  logger.json(user)

  await user.save()

  logger.debug('Successfully saved user to database.')

  // return user in successful response
  res.json({
    success: true,
    user
  })
}
