import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'
import { Icons } from '@linkdrop/ui-kit'

class PageExpandable extends React.Component {
  render () {
    const { children, expanded, onClose } = this.props
    return <div className={classNames(styles.container, {
      [styles.expanded]: expanded
    })}
    >
      <div className={styles.header}>
        <div className={styles.closeIcon} onClick={_ => onClose && onClose()}>
          <Icons.CloseArrow />
        </div>
      </div>
      <div
        className={styles.content}
      >
        {children}
      </div>
    </div>
  }
}

export default PageExpandable
