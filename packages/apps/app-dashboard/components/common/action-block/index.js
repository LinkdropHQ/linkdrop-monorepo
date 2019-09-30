import React from 'react'
import styles from './styles.module'
import { Button } from 'components/common'
import classNames from 'classnames'

class ActionBlock extends React.Component {
  render () {
    const { title, description, extraContent, transparent, onClick, buttonTitle, href } = this.props
    return <div className={classNames(styles.container, { [styles.transparent]: transparent })}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <div className={styles.description}>{description}</div>}
      {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
      {(onClick || href) && <Button href={href} className={styles.button} onClick={_ => onClick && onClick()}>{buttonTitle}</Button>}
    </div>
  }
}

export default ActionBlock
