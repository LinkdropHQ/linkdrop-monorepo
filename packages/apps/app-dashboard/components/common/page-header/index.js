import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'

@actions(({ user: { chainId } }) => ({ chainId }))
@translate('common.pageHeader')
class PageHeader extends React.Component {
  render () {
    const { title, chainId } = this.props
    return <div className={styles.container}>
      <div className={styles.title}>
        {title}
      </div>
    </div>
  }
}

export default PageHeader
