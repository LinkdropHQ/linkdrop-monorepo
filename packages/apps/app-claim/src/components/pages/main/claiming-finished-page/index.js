import React from 'react'
import { Alert, Icons, Button } from '@linkdrop/ui-kit'
import { Input } from 'components/common'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { getDappData } from 'helpers'
import { getHashVariables, defineEtherscanUrl } from '@linkdrop/commons'
import classNames from 'classnames'
import FakeCheckbox from './fake-checkbox.png'

@actions(({
  tokens: {
    transactionId,
    transactionStatus
  },
  user: {
    loading,
    sendDataStatus
  }
}) => ({
  transactionId,
  transactionStatus,
  loading,
  sendDataStatus
}))
@translate('pages.main')
class ClaimingFinishedPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      formShow: false,
      email: ''
    }
  }
  render () {
    const { chainId, dappId, hideSubscribe } = getHashVariables()
    const { formShow, email } = this.state
    const { transactionId, amount, wallet, symbol, transactionStatus, loading, sendDataStatus } = this.props
    return <div className={classNames(commonStyles.container, {
      [styles.formShow]: formShow
    })}>
      <Alert
        icon={transactionStatus === 'failed' ? <Icons.Exclamation /> : <Icons.Check />}
        className={styles.alert}
      />
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{
          __html: this.t(transactionStatus === 'failed' ? 'titles.claimFailed' : 'titles.tokensClaimed', {
            tokens: `${amount || ''} ${symbol || ''}`
          })
        }}
      />
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
      {this.renderDappButton({ dappId, transactionId, transactionStatus })}
      {this.renderSubscribeForm({ hideSubscribe, wallet, email, loading, sendDataStatus, transactionId })}
    </div>
  }

  renderDappButton ({ dappId, transactionId, transactionStatus }) {
    if (transactionStatus === 'failed') { return null }
    const dappData = getDappData({ dappId })
    if (!dappData) { return null }
    return <Button
      className={classNames(styles.button, {
        [styles.disableTranslateY]: !transactionId
      })}
      target='_blank'
      href={dappData.link}
    >
      {this.t('buttons.goTo', { dapp: dappData.name })}
    </Button>
  }


  renderSubscribeForm ({ hideSubscribe, email, loading, sendDataStatus, transactionId, wallet }) {
    if (hideSubscribe) { return null }
    return <div className={classNames(styles.form, {
      [styles.formLoading]: loading,
      [styles.formFinished]: sendDataStatus === 'success',
      [styles.formFailed]: sendDataStatus === 'failed',
      [styles.disableTranslateY]: !transactionId
    })}>
      <div className={classNames(styles.formOverlay, styles.formLoadingOverlay)} />
      <div className={classNames(styles.formOverlay, styles.formSuccessOverlay)}>{this.t('titles.subscribed')}</div>
      <div className={classNames(styles.formOverlay, styles.formFailedOverlay)}>{this.t('titles.failed')}</div>
      <div className={styles.formTitle} onClick={_ => this.setState({ formShow: true })}>
        {this.t('titles.formTitle')} <Icons.ExpandArrowIcon />
      </div>

      <div className={styles.formContent}>
        <div className={styles.formInput}>
          <Input
            value={email}
            type='email'
            placeholder={this.t('titles.yourEmail')}
            className={styles.input}
            onChange={({ value }) => this.setState({ email: value })}
          />
          <div
            className={styles.formButton}
            onClick={_ => {
              this.actions().user.saveData({ email, account: wallet })
            }}
          >
           <Icons.ContinueArrow />
          </div>
        </div>
        <div className={styles.fakeCheckbox}>
          <img src={FakeCheckbox} /> {this.t('titles.fakeCheckbox')}
        </div>
      </div>
    </div>
  }
}

export default ClaimingFinishedPage
