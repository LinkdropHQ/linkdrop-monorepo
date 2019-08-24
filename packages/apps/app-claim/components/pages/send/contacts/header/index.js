import React from 'react'
import styles from './styles.module'

const Header = ({ title }) => <div className={styles.container}>
  <h2 className={styles.title}>{title}</h2>
</div>

export default Header
