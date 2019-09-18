import React from 'react'
import styles from './styles.module.scss'
import Header from '../header'

class Page extends React.Component {
  render () {
    const { children } = this.props
    return <div className={styles.container}>
      <Header />
      <div className={styles.content}>
        {children}
        <div className='page-widget'>
        </div>
      </div>
    </div>
  }
}

export default Page