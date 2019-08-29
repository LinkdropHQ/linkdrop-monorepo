import React from 'react'
import styles from './styles.module'

class Footer extends React.Component {
  render () {
    const { content } = this.props
    return <footer className={styles.container}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </footer>
  }
}

export default Footer
