import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'

class Header extends React.Component {
  render () {
    const { title, className } = this.props
    return <header className={classNames(styles.container, className)}>
      {title}
    </header>
  }
}

export default Header
