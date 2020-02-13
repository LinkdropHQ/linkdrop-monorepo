import fetch from '../fetch'
import { apiHost } from 'app.config.js'

export default ({ email, passwordHash }) => {
	const body = JSON.stringify({ email, passwordHash })
	return fetch(`${apiHost}/generate-link`, { method: 'POST', body })
}
