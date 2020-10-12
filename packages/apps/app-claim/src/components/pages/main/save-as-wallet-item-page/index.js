import React from 'react'
import { Button, RetinaImage } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import { getImages } from 'helpers'
import text from 'texts'
import classNames from 'classnames'

import styles from './styles.module'
import commonStyles from '../styles.module'
@translate('pages.main')
class SaveAsWalletItemPage extends React.Component {
  render () {
    const { onClick, loading } = this.props
    return <div className={commonStyles.container}>
      <div className={styles.icon}>
        <RetinaImage width={90} {...getImages({ src: 'apple-wallet' })} />
      </div>
      <div className={styles.title} dangerouslySetInnerHTML={{__html: this.t('titles.claimToAppleWallet')}} />
      <Button className={styles.button} onClick={_ => onClick && onClick()}>
        {text('common.buttons.claim')}
      </Button>
    </div>
  }
}

export default SaveAsWalletItemPage
