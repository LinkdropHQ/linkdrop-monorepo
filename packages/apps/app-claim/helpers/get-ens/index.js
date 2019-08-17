export default ({ email = '' }) => email.slice(0, email.indexOf('@')).replace('.', '-') + '.linkdrop.test'
