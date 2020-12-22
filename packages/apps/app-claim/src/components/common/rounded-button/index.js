import React from 'react'
import { Button } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import styles from './styles.module'
import { getHashVariables } from '@linkdrop/commons'

const RoundedButton = props => {
  const { variant } = getHashVariables() 
  return <Button {...props} className={
    classNames(props.className, {
      [styles.container]: variant
    })
  }>
    {props.children}
  </Button>
}

export default RoundedButton
 