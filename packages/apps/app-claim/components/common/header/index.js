import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import { RetinaImage } from '@linkdrop/ui-kit'
import { getImages } from 'helpers'

@translate('common.header')
class Header extends React.Component {
  render () {
    return <div className={styles.container}>
      <RetinaImage width={60} {...getImages({ src: 'snark' })} />
      <div className={styles.title}>{this.t('titles.main')}</div>
    </div>
  }
}

export default Header
