import React from 'react'
import styles from './styles.module'
import { Input } from '@linkdrop/ui-kit'
import classNames from 'classnames'

class InputComponent extends React.Component {
  render () {
    const { title, placeholder, className, onChange, disabled, value } = this.props
    return <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <Input value={value} className={classNames(className, styles.input)} disabled={disabled} onChange={value => onChange && onChange(value)} placeholder={placeholder} />
    </div>
  }
}

export default InputComponent
