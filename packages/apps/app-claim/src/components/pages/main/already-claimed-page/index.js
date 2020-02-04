import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getDappData } from 'helpers'
import { getHashVariables, defineEtherscanUrl } from '@linkdrop/commons'
import classNames from 'classnames'
import { defineMainAsset } from 'helpers'

@actions(({ tokens: { transactionId } }) => ({ transactionId }))
@translate('pages.main')
class AlreadyClaimedPage extends React.Component {
  render () {
    const { chainId } = getHashVariables()
    const { transactionId, assets } = this.props
    const { symbol, amount, icon } = defineMainAsset({ assets })
    return <div className={commonStyles.container}>
      <Alert icon={<Icons.Check />} className={styles.alert} />
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.tokensAlreadyClaimed') }} />
      <div
        className={classNames(styles.description, {
          [styles.descriptionHidden]: !transactionId
        })}
        dangerouslySetInnerHTML={{
          __html: this.t(`titles.seeDetails`, {
            transactionLink: `${defineEtherscanUrl({ chainId })}tx/${transactionId}`
          })
        }}
      />
    </div>
  }
}

export default AlreadyClaimedPage
