export default (state, { payload: { privateKey, contractAddress, ens, avatar } }) => {
  return ({ ...state, privateKey, contractAddress, ens, avatar })
}
