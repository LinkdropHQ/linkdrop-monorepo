import React from 'react'
import styles from './styles.module'
import { Icons } from '@linkdrop/ui-kit'
import close from './close.png'

class Note extends React.Component {
  render () {
    const { title, onClose } = this.props
    return <div className={styles.container}>
      <div className={styles.title} dangerouslySetInnerHTML={{ __html: title }} />
      {onClose && <div onClick={_ => onClose && onClose()} className={styles.close}>
        <img src={close} />
      </div>}
    </div>
  }
}

export default Note
