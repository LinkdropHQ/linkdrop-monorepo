import React from 'react'
import styles from '../styles.module'
import classNames from 'classnames'
import { Slider, RetinaImage, Button } from '@linkdrop/ui-kit'
import { getImages } from 'helpers'
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
  return <div
    className={classNames(styles.wallet, styles.withBorder)}
    onClick={_ => selectWallet && selectWallet({ id })}
  >
    {icon}
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

const ANDROID_WALLETS = ['trust', 'coinbase', 'opera', 'imtoken', 'status', 'gowallet', 'fortmatic', 'portis']
const IOS_WALLETS = ['trust', 'coinbase', 'imtoken', 'status', 'tokenpocket', 'opera', 'fortmatic', 'portis']
