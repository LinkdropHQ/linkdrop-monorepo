export default (state, { payload: { privateKey, contractAddress, ens, avatar } }) => ({ ...state, privateKey, contractAddress, ens, avatar })
