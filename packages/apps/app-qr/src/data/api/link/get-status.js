import fetch from '../fetch'

export default ({ linkId }) => fetch(`${apiHost}/get-status/${linkId}`)
