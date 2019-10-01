import { takeEvery } from 'redux-saga/effects'

import createProxyAddress from './every/create-proxy-address'
import prepareNewERC20Data from './every/prepare-new-erc20-data'
import prepareNewERC721Data from './every/prepare-new-erc721-data'
import prepareNewEthData from './every/prepare-new-eth-data'
import proceedPayment from './every/proceed-payment'
import resetData from './every/reset-data'
import save from './every/save'
import getCSV from './every/get-csv'
import changeStatus from './every/change-status'
import checkStatusTxHash from './every/check-status-tx-hash'

export default function * () {
  yield takeEvery('*CAMPAIGNS.CREATE_PROXY_ADDRESS', createProxyAddress)
  yield takeEvery('*CAMPAIGNS.PREPARE_NEW_ERC20_DATA', prepareNewERC20Data)
  yield takeEvery('*CAMPAIGNS.PREPARE_NEW_ERC721_DATA', prepareNewERC721Data)
  yield takeEvery('*CAMPAIGNS.PREPARE_NEW_ETH_DATA', prepareNewEthData)
  yield takeEvery('*CAMPAIGNS.PROCEED_PAYMENT', proceedPayment)
  yield takeEvery('*CAMPAIGNS.SAVE', save)
  yield takeEvery('*CAMPAIGNS.RESET_DATA', resetData)
  yield takeEvery('*CAMPAIGNS.GET_CSV', getCSV)
  yield takeEvery('*CAMPAIGNS.CHANGE_STATUS', changeStatus)
  yield takeEvery('*CAMPAIGNS.CHECK_STATUS_TX_HASH', checkStatusTxHash)
}
