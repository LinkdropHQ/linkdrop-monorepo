import React from 'react'
import { Alert, Icons, Button } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import { getCurrentAsset } from 'helpers'
import text from 'texts'

import styles from './styles.module'
import commonStyles from '../styles.module'

@translate('pages.claim')
class InitialPage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      iconType: 'default'
    }
  }

  // componentWillReceiveProps ({ icon }) {
  //   const { icon: prevIcon } = this.props
  //   const { iconType } = this.state
  //   if (prevIcon !== icon && icon != null && iconType !== 'default') {
  //     this.setState({
  //       iconType: 'default'
  //     })
  //   }
  // }

  render () {
    const { onClick, loading, wallet, itemsToClaim } = this.props
    const assetToShow = getCurrentAsset({ itemsToClaim })
    if (!assetToShow) { return null }
    const { balanceFormatted, icon, symbol } = assetToShow
    const { iconType } = this.state
    const finalIcon = iconType === 'default' ? <img onError={_ => this.setState({ iconType: 'blank' })} className={styles.icon} src={icon} /> : <Icons.Star />
    return <div className={commonStyles.container}>
      <Alert noBorder={iconType === 'default' && symbol !== 'ETH'} className={styles.tokenIcon} icon={finalIcon} />
      <div className={styles.title}>
        <span>{balanceFormatted}</span> {symbol}
      </div>
      <Button disabled={loading} className={styles.button} onClick={_ => onClick && onClick()}>
        {text('common.buttons.claim')}
      </Button>
      <div className={styles.terms} dangerouslySetInnerHTML={{ __html: this.t('titles.agreeWithTerms', {
        href: 'https://www.notion.so/Terms-and-Privacy-dfa7d9b85698491d9926cbfe3c9a0a58'
      }) }} />
    </div>
  }
}

export default InitialPage
