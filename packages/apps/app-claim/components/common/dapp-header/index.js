import React from 'react'
import styles from './styles.module'

const DappHeader = ({ title, onClose }) => <div className={styles.container}>
  {title}
</div>

export default DappHeader
