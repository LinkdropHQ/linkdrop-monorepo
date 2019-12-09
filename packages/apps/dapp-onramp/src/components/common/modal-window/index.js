import React from 'react'
import styles from './styles.module'
import { CrossIcon } from 'components/common'

const ModalWindowComponent = ({ children, onClose }) => {
  return <div className={styles.container}>
  	<div className={styles.closeButton} onClick={_ => onClose && onClose()}>
  		<CrossIcon />
  	</div>
    {children}
  </div>
}

export default ModalWindowComponent
