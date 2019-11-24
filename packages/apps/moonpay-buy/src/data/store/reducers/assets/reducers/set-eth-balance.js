export default (state, { payload: { ethBalance, ethBalanceFormatted } }) => ({ ...state, ethBalanceFormatted, ethBalance })
