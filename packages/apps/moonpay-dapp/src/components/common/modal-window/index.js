import React from 'react'
import styles from './styles.module'

const ModalWindowComponent = props => {
  return <div className={styles.container}>
    {props.children}
  </div>
}

export default ModalWindowComponent
