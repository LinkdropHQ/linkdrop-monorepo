import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getDappData } from 'helpers'
import { getHashVariables, defineEtherscanUrl } from '@linkdrop/commons'
import classNames from 'classnames'
import { defineMainAsset } from 'helpers'
import { Button } from 'components/common'

@actions(({ tokens: { transactionId } }) => ({ transactionId }))
@translate('pages.main')
class ClaimingFinishedPage extends React.Component {
  render () {
    const { chainId } = getHashVariables()
    const { transactionId, assets } = this.props
    const { symbol, amount, icon } = defineMainAsset({ assets })
    return <div className={commonStyles.container}>
      <Alert icon={<Icons.Check />} className={styles.alert} />
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.tokensClaimed', { tokens: `${amount || ''} ${symbol || ''}` }) }} />
      <div className={styles.description} dangerouslySetInnerHTML={{ __html: this.t('titles.putTokensToWork') }}/>
      {this.renderDappButton({ transactionId })}
    </div>
  }

  renderDappButton ({ transactionId }) {
    return <Button
      className={styles.button}
      target='_blank'
      href='https://0x.org/zrx/staking'
    >
      {this.t('buttons.stakeOn0x')}
    </Button>
  }
}

export default ClaimingFinishedPage
