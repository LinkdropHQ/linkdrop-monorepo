import fetch from '../fetch'

export default ({ hash }) => fetch(`https://storage.snark.art/ipfs/${hash}`)
