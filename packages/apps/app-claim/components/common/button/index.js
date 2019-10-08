import React from 'react'
import styles from './styles.module'
import { Button } from '@linkdrop/ui-kit'

class ButtonComponent extends React.Component {
  render () {
    return <Button {...this.props} inverted className={styles.container} />
  }
}

export default ButtonComponent
