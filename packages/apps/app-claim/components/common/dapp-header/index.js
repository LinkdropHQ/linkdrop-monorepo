import React from 'react'
import styles from './styles.module'
import { Icons } from '@linkdrop/ui-kit'

const DappHeader = ({ title, onClose }) => <div className={styles.container}>
  <div className={styles.close} onClick={_ => onClose && onClose()}>
    <Icons.Cross />
  </div>
  {title} <div className={styles.indicator} />
</div>

export default DappHeader
