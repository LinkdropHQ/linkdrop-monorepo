import React from 'react'
import styles from './styles.module'
import { ComponentInternalLoading, Icons } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import classNames from 'classnames'
import variables from 'variables'

@translate('common.tokensAmount')
class TokensAmount extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showMessage: false
    }
  }

  componentDidMount () {
    window.setTimeout(_ => this.setState({ showMessage: true }), 3000)
  }

  render () {
    const { showMessage } = this.state
    const { loading, symbol, amount, decimals } = this.props
    const text = this.defineText({ loading, symbol, amount })
    const icon = this.defineIcon({ loading })
    return <div className={styles.wrapper}>
      <div className={classNames(styles.container, {
        [styles.loading]: loading
      })}>
        {icon} {text}
      </div>
      {showMessage && <div className={styles.message}>{this.t('titles.loadingNote')}</div>}
    </div>
  }

  defineText ({ loading, amount, symbol }) {
    if (loading) return `${this.t('titles.claiming')} ${amount} ${symbol}...`
    return `${amount} ${symbol} ${this.t('titles.claimed')}`
  }

  defineIcon ({ loading }) {
    if (loading) return <ComponentInternalLoading className={styles.loadingComponent} color={variables.dbBlue} />
    return <span className={styles.loadingComponent}><Icons.CheckSmall stroke={variables.greenColor} /></span>
  }
}

export default TokensAmount
