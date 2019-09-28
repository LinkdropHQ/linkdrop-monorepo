import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Input } from 'components/common'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class TokenAddressInput extends React.Component {
  render () {
    const { tokenAddress, setField, tokenType } = this.props
    if (tokenType === 'eth') { return null }
    return <div className={styles.tokenAddress}>
      <div className={styles.tokensAddressContainer}>
        <Input placeholder={this.t('titles.tokenAddressPlaceholder')} className={styles.inputFullSize} value={tokenAddress || ''} onChange={({ value }) => setField({ field: 'tokenAddress', value })} />
      </div>
    </div>
  }
}

export default TokenAddressInput
