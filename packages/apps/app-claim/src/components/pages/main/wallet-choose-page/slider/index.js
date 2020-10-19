import React from 'react'
import styles from '../styles.module'
import classNames from 'classnames'
import { Slider, RetinaImage, Button } from '@linkdrop/ui-kit'
import { getImages, getWalletData } from 'helpers'
import { getHashVariables } from '@linkdrop/commons'

const SliderComponent = ({ t, walletType, selectWallet, showSlider, platform }) => {
  return <div className={styles.content}>
    <div onClick={_ => showSlider && showSlider()} className={styles.subtitle}>{t('titles.haveAnother')}</div>
    <Slider visibleSlides={4} className={styles.slider} step={4}>
      {(platform === 'ios' ? IOS_WALLETS : ANDROID_WALLETS).map(wallet => renderImage({ id: wallet, platform, walletType, selectWallet }))}
    </Slider>
    {/* <Button
      onClick={() => context.setConnector('Fortmatic')}
    >
      fortmatic
    </Button> */}
  </div>
}

const renderImage = ({ id, walletType, selectWallet, platform }) => {
  const { w = 'trust' } = getHashVariables()
  if (walletType === id) { return null }
  if (walletType == null && id === w) { return null }
  const icon = renderIcon({ id, platform })
  const title = getWalletData({ wallet: id }).name
  return <div className={styles.walletContainer}>
    <div
      className={classNames(styles.wallet, styles.withBorder)}
      onClick={_ => selectWallet && selectWallet({ id })}
    >
      {icon}
    </div>
    <div className={styles.walletTitle}>{title}</div>
  </div>
}

const renderIcon = ({ id, platform }) => {
  let imageId = id
  if (id === 'opera') {
    if (platform === 'ios') {
      imageId = 'opera-touch'
    }
  }
  return <RetinaImage width={60} {...getImages({ src: imageId })} />
}

export default SliderComponent

const ANDROID_WALLETS = ['coinbase', 'walletconnect', 'metamask', 'fortmatic', 'status', 'imtoken', 'portis', 'opera', 'trust', 'gowallet', 'buntoy']
const IOS_WALLETS = ['coinbase', 'walletconnect', 'metamask', 'fortmatic', 'status', 'imtoken', 'portis', 'opera', 'trust', 'tokenpocket']