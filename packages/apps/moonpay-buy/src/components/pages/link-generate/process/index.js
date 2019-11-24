import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { Loading } from '@linkdrop/ui-kit'
@actions(({ link }) => ({ link }))
@translate('pages.linkGenerate')
class Process extends React.Component {
  componentDidMount () {
    this.actions().link.createLink()
  }

  render () {
    return <div className={styles.container}>
      <div className={styles.loadingWrapper}>
        <Loading className={styles.loading} size='small' />
      </div>
      <div className={styles.title}>{this.t('titles.main')}</div>
      <div className={styles.subtitle}>{this.t('titles.subtitle')}</div>
    </div>
  }
}

export default Process
