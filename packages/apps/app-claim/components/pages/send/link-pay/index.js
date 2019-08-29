import React from 'react'
import styles from './styles.module'
import { Button } from '@linkdrop/ui-kit'

class LinkPay extends React.Component {
  render () {
    const { onClick, disabled, title } = this.props
    return <div className={styles.container}>
      <Button className={styles.button} onClick={_ => onClick && onClick()} disabled={disabled}>{title}</Button>
    </div>
  }
}

export default LinkPay
