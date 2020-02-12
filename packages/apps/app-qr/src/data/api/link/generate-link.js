import fetch from '../fetch'

export default () => fetch(`${apiHost}/generate-link`, { method: 'POST' })
