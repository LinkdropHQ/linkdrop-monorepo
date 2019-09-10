import React from 'react'
import { translate, actions } from 'decorators'
import commonStyles from '../styles.module'
import { TokensAmount, AccountBalance, Confetti } from 'components/common'
import { Loading } from '@linkdrop/ui-kit'
import { getCurrentAsset } from 'helpers'
import { AssetsList } from 'components/pages/common'

@actions(({ assets: { items, itemsToClaim }, user: { ens } }) => ({ items, ens }))
@translate('pages.claim')
class ClaimingFinishedPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showAssets: false
    }
  }

  componentDidMount () {
    window.setTimeout(_ => this.setState({ showAssets: true }), 3000)
  }

  render () {
    const { items, itemsToClaim, alreadyClaimed, loading, claimingFinished } = this.props
    const { showAssets } = this.state
    const mainAsset = getCurrentAsset({ itemsToClaim })
    if (!mainAsset) { return null }
    const { balanceFormatted, symbol } = mainAsset
    return <div className={commonStyles.container}>
      {claimingFinished && <Confetti recycle={!showAssets} />}
      {loading && <Loading withOverlay />}
      <AccountBalance items={items} />
      {!showAssets && <TokensAmount alreadyClaimed={alreadyClaimed} claimingFinished={claimingFinished} symbol={symbol} amount={balanceFormatted} />}
      {showAssets && <AssetsList />}
    </div>
  }
}

export default ClaimingFinishedPage
