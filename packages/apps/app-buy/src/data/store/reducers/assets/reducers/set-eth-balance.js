export default (state, { payload: { ethBalance, ethBalanceFormatted } }) => {
	return { ...state, ethBalanceFormatted, ethBalance }
}
