export default (state, { payload: { privateKey, contractAddress, ens } }) => ({ ...state, privateKey, contractAddress, ens })
