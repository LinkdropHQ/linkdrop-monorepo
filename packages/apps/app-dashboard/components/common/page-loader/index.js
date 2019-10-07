import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'
import { Loading } from '@linkdrop/ui-kit'

@translate('common.pageLoader')
class PageLoader extends React.Component {
  render () {
    const { transaction } = this.props
    const text = transaction ? this.t('transactionLoading') : this.t('loading')
    return <div className={styles.container}>
      <Loading />
      <div className={styles.text} dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  }
}

export default PageLoader
