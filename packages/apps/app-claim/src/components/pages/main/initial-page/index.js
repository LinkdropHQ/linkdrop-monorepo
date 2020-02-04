import React from 'react'
import { RetinaImage } from '@linkdrop/ui-kit'
import { translate } from 'decorators'
import { shortenString } from '@linkdrop/commons'
import text from 'texts'
import classNames from 'classnames'
import { get0xAssets, getImages } from 'helpers'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { Button } from 'components/common'

@translate('pages.main')
class InitialPage extends React.Component {
  render () {
    const { onClick, assets, wallet, loading } = this.props
    const assetsTitle = get0xAssets({ assets })
    return <div className={commonStyles.container}>
      <div className={styles.icon}>
        <RetinaImage width={147} {...getImages({ src: '0x' })} />
      </div>
      <div
        className={styles.title}
        dangerouslySetInnerHTML={{
          __html: this.t(`titles.${wallet ? 'linkContentsReady' : 'linkContents'}`, {
            contents: assetsTitle
          })
        }}
      />
      <Button loading={loading} className={styles.button} onClick={_ => onClick && onClick()}>
        {text('common.buttons.claim')}
      </Button>
      {wallet && <div className={styles.wallet} dangerouslySetInnerHTML={{ __html: this.t('titles.claimTo', { wallet: shortenString({ wallet }) }) }} />}
      <div
        className={styles.terms}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.agreeWithTerms', {
            href: 'https://www.notion.so/Terms-and-Privacy-dfa7d9b85698491d9926cbfe3c9a0a58'
          })
        }}
      />
    </div>
  }
}

export default InitialPage
