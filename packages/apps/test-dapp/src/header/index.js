import React from 'react'
import styles from './styles.module.scss'
import zeroXImg from 'assets/images/0x.png'

class Header extends React.Component {
  render () {
    return <header className={styles.container}>
      <img className={styles.logo} src={zeroXImg} />
      Swap Tokens
    </header>
  }
}

export default Header