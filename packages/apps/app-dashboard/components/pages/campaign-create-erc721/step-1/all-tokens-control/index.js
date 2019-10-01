import React from 'react'
import styles from './styles.module'
import { Button } from '@linkdrop/ui-kit'

const AllTokensControl = ({ onClick, title }) => <div className={styles.container}>
  <Button inverted onClick={_ => onClick && onClick()} className={styles.button}>{title}</Button>
</div>

export default AllTokensControl
