import React from 'react'
import { Input } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import styles from './styles.module'


const InputComponent = props => <Input {...props} className={classNames(styles.container, props.className)} />
export default InputComponent