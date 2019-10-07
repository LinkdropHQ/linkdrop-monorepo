import React from 'react'
import { Alert, Icons, Button } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import { shortenString, getHashVariables } from '@linkdrop/commons'
import text from 'texts'
import classNames from 'classnames'

import styles from './styles.module'
import commonStyles from '../styles.module'
@translate('pages.main')
class InitialPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      iconType: 'default'
    }
  }

  componentWillReceiveProps ({ icon }) {
    const { icon: prevIcon } = this.props
    const { iconType } = this.state
    if (prevIcon !== icon && icon != null && iconType !== 'default') {
      this.setState({
        iconType: 'default'
      })
    }
  }

  render () {
    const { onClick, amount, symbol, loading, icon, wallet } = this.props
    const { iconType } = this.state
    const { nftAddress } = getHashVariables()
    const finalIcon = iconType === 'default' ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.icon} src={icon} /> : <Icons.Star />
    return <div className={commonStyles.container}>
      <Alert
        noBorder={iconType === 'default' && symbol !== 'ETH' && symbol !== 'xDAI'} className={classNames(styles.tokenIcon, {
          [styles.tokenIconNft]: nftAddress
        })} icon={finalIcon}
      />
      <div className={styles.title}>
        <span>{amount && parseFloat(amount)}</span> {symbol}
      </div>
      <Button loading={loading} className={styles.button} onClick={_ => onClick && onClick()}>
        {text('common.buttons.claim')}
      </Button>
      <div
        className={styles.terms} dangerouslySetInnerHTML={{
          __html: this.t('titles.agreeWithTerms', {
            href: 'https://www.notion.so/Terms-and-Privacy-dfa7d9b85698491d9926cbfe3c9a0a58'
          })
        }}
      />
      {wallet && <div className={styles.wallet} dangerouslySetInnerHTML={{ __html: this.t('titles.claimTo', { wallet: shortenString({ wallet }) }) }} />}
    </div>
  }
}

export default InitialPage
