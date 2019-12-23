import React from 'react'
import { Alert, Icons, Button } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getDappData } from 'helpers'
import { getHashVariables, defineEtherscanUrl } from '@linkdrop/commons'
import classNames from 'classnames'

@actions(({ tokens: { transactionId } }) => ({ transactionId }))
@translate('pages.main')
class ClaimingFinishedPage extends React.Component {
  render () {
    const { chainId, dappId } = getHashVariables()
    const { transactionId, amount, symbol } = this.props
    return <div className={commonStyles.container}>
      <Alert icon={<Icons.Check />} className={styles.alert} />
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.tokensClaimed', { tokens: `${amount || ''} ${symbol || ''}` }) }} />
      <div
        className={classNames(styles.description, {
          [styles.descriptionHidden]: !transactionId
        })}
        dangerouslySetInnerHTML={{
          __html: this.t(`titles.${Number(chainId) === 100 ? 'seeDetailsBlockscout' : 'seeDetails'}`, {
            transactionLink: `${defineEtherscanUrl({ chainId })}tx/${transactionId}`
          })
        }}
      />
      {this.renderDappButton({ dappId, transactionId })}
    </div>
  }

  renderDappButton ({ dappId, transactionId }) {
    const dappData = getDappData({ dappId })
    if (!dappData) { return null }
    return <Button
      className={classNames(styles.button, {
        [styles.disableTranslateX]: !transactionId
      })}
      target='_blank'
      href={dappData.link}
    >
      {this.t('buttons.goTo', { dapp: dappData.name })}
    </Button>
  }
}

export default ClaimingFinishedPage
