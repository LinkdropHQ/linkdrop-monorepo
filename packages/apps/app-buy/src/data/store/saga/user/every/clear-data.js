import { put, select } from 'redux-saga/effects'
const ls = window.localStorage

const generator = function * () {
  try {
  	const application = yield select(generator.selectors.application)
    ls && ls.removeItem('link')
    ls && ls.removeItem('minifiedLink')
    ls && ls.removeItem('ethBalance')
    ls && ls.removeItem('ethBalanceFormatted')
    window.location.href = `/#/${application}`
    window.location.reload()
  } catch (e) {
    console.error(e)
  }
}

export default generator
generator.selectors = {
	application: ({ user: { application } }) => application
}