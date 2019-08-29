import React from 'react'
import styles from './styles.module'
import { Input } from '@linkdrop/ui-kit'

class InputComponent extends React.Component {
  render () {
    const { title, placeholder, onChange, disabled } = this.props
    return <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <Input disabled={disabled} onChange={value => onChange && onChange(value)} placeholder={placeholder} className={styles.input} />
    </div>
  }
}

export default InputComponent
