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
    const { chainId, dappId, subscribe, variant } = getHashVariables()
    const { formShow, email } = this.state
    const { transactionId, amount, wallet, symbol, transactionStatus, loading, sendDataStatus } = this.props
    return <div className={classNames(commonStyles.container, {
      [styles.formShow]: formShow
    })}>
      <Alert
        icon={transactionStatus === 'failed' ? <Icons.Exclamation /> : <Icons.Check />}
        className={styles.alert}
      />
      {this.renderTitles({ transactionStatus, amount, symbol, variant })}
      {this.renderEtherscanUrl({ transactionId, chainId })}
      {this.renderTokenCheckInstruction({ variant, wallet })}
      {this.renderDappButton({ dappId, transactionId, transactionStatus })}
      {this.renderSubscribeForm({ variant, subscribe, wallet, email, loading, sendDataStatus, transactionId })}
    </div>
  }


  renderTitles ({ transactionStatus, amount, symbol, variant }) {
    if (variant) {
      return <div
      className={styles.title}>
        <div dangerouslySetInnerHTML={{ __html: this.t('titles.congrats') }} />
        <div dangerouslySetInnerHTML={{ __html: this.t('titles.nftClaimed') }} />
      </div>
    }
    return <div
      className={styles.title}
      dangerouslySetInnerHTML={{
        __html: this.t(transactionStatus === 'failed' ? 'titles.claimFailed' : 'titles.tokensClaimed', {
          tokens: `${amount || ''} ${symbol || ''}`
        })
      }}
    />
  }

  renderEtherscanUrl ({ transactionId, chainId }) {
    const scannerDct = {
      "100": 'seeDetailsBlockscout',      
      "97": 'seeDetailsBscScan',
      "56": 'seeDetailsBscScan',
      "137": 'seeDetailsExplorer',
    }
    const seeDetails = scannerDct[String(chainId)] || 'seeDetails'

    return <div
      className={classNames(styles.description, {
        [styles.descriptionHidden]: !transactionId
      })}
      dangerouslySetInnerHTML={{
        __html: this.t(`titles.${seeDetails}`, {
          transactionLink: `${defineEtherscanUrl({ chainId })}tx/${transactionId}`
        })
      }}
    />
  }

  renderTokenCheckInstruction ({ variant, wallet }) {
    if (!variant) { return null }
    return <div>
      <div
        className={classNames(styles.description, styles.descriptionMarginBottom)}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.howToSeeTokens', {
            openseaHref: `https://opensea.io/${wallet ? `accounts/${wallet}` : ''}`,
            raribleHref: `https://app.rarible.com/${wallet ? `user/${wallet}/collectibles` : ''}`
          })
        }}
      />
      <div className={classNames(styles.description, styles.descriptionMarginBottom)}>{this.t('titles.or')}</div>
      <div
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.viewTheEntireSeries', {
            href: 'https://artblocks.io/project/5'
          })
        }}
      />
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


  renderSubscribeForm ({ variant, subscribe, email, loading, sendDataStatus, transactionId, wallet }) {
    if (subscribe && subscribe === 'false') { return null }
    if (variant) { return null }
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
