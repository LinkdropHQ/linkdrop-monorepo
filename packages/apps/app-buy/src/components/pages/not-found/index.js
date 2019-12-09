import React from 'react'
import styles from './styles.module'

class NotFound extends React.Component {
  render () {
    const { children } = this.props
    return <div className={styles.container}>
        Page not found
    </div>
  }
}

export default NotFound
