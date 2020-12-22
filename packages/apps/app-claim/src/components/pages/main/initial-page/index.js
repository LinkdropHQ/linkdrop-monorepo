import React from 'react'
import { Alert, Icons } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import { shortenString, getHashVariables } from '@linkdrop/commons'
import text from 'texts'
import classNames from 'classnames'
import { RoundedButton } from 'components/common'

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

  renderIcon ({ icon, nftAddress, symbol, variant }) {
    const { iconType } = this.state
    const finalIcon = iconType === 'default' ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.icon} src={icon} /> : <Icons.Star />
    return <Alert
      noBorder={iconType === 'default' && symbol !== 'ETH' && symbol !== 'xDAI'} className={classNames(styles.tokenIcon, {
        [styles.tokenIconNft]: nftAddress && iconType === 'default',
        [styles.tokenIconNftLarge]: nftAddress && variant
      })} icon={finalIcon}
    />
  }

  renderTitle ({ variant, amount, symbol }) {
    const title = variant ? this.t('titles.claimInstruction'): <><span>{amount && parseFloat(amount)}</span> {symbol}</>
    return <div className={classNames(styles.title, {
      [styles.titleVariant]: variant
    })}>
      {title}
    </div>
  }

  render () {
    const { onClick, amount, symbol, loading, icon, wallet } = this.props
    const { nftAddress, variant } = getHashVariables()
    return <div className={commonStyles.container}>
      {this.renderIcon({ nftAddress, symbol, variant, icon })}
      {this.renderTitle({ variant, amount, symbol })}
      <RoundedButton
        loading={loading}
        className={styles.button}
        onClick={_ => onClick && onClick()}
      >
        {text('common.buttons.claim')} {variant && 'NFT'}
      </RoundedButton>
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
