import React from 'react'
import styles from './styles.module'
import { ComponentInternalLoading, Icons } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import classNames from 'classnames'
import variables from 'variables'
import config from 'config-claim'

@translate('common.tokensAmount')
class TokensAmount extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMessage: false
    }
  }

  componentDidMount () {
    const { alreadyClaimed, claimingFinished } = this.props
    if (alreadyClaimed || claimingFinished) { return }
    window.setTimeout(_ => this.setState({ showMessage: true }), 3000)
  }

  render () {
    const { showMessage } = this.state
    const {
      loading,
      symbol,
      amount,
      decimals,
      alreadyClaimed,
      link,
      transactionId,
      chainId = '1',
      claimingFinished
    } = this.props
    const text = this.defineText({ loading, symbol, amount, claimingFinished, alreadyClaimed })
    const icon = this.defineIcon({ loading })
    return <div className={styles.wrapper}>
      <div className={classNames(styles.container, {
        [styles.loading]: loading,
        [styles.alreadyClaimed]: alreadyClaimed,
        [styles.claimingFinished]: claimingFinished
      })}
      >
        {!alreadyClaimed && icon} {text}
      </div>
      {showMessage && transactionId && <div
        className={styles.message}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.loadingNote', { link: `${chainId === '4' ? config.etherscanRinkeby : config.etherscanMainnet}${transactionId}` })
        }}
      />}
    </div>
  }

  defineText ({ loading, amount, symbol, alreadyClaimed, claimingFinished }) {
    if (loading) return `${this.t('titles.claiming')} ${amount} ${symbol}...`
    if (claimingFinished) return `${amount} ${symbol} ${this.t('titles.claimed')}`
    if (alreadyClaimed) return this.t('titles.alreadyClaimed')
  }

  defineIcon ({ loading }) {
    if (loading) return <ComponentInternalLoading className={styles.loadingComponent} color={variables.dbBlue} />
    return <span className={styles.loadingComponent}><Icons.CheckSmall stroke={variables.greenColor} /></span>
  }
}

export default TokensAmount
