import boom from '@hapi/boom'

const wrapAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(err => {
    if (!err.isBoom) {
      if (err.name === 'CastError' || err.kind === 'ObjectId') {
        return next(boom.notFound('Not found'))
      }
      return next(boom.badImplementation(err))
    }
    next(err)
  })
}

export default wrapAsync
