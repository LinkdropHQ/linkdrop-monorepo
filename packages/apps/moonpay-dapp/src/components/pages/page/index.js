import React from 'react'
import styles from './styles.module'

class Page extends React.Component {
  render () {
    const { children } = this.props
    return <div className={styles.container}>
      <div
        className={styles.main}
      >
        {children}
      </div>
    </div>
  }
}

export default Page
