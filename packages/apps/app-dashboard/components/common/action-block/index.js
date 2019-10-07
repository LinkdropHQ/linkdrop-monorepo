import React from 'react'
import styles from './styles.module'
import { Button } from 'components/common'
import classNames from 'classnames'

class ActionBlock extends React.Component {
  render () {
    const { title, description, transparentButton, extraContent, transparent, onClick, buttonTitle, href, className } = this.props
    return <div className={classNames(styles.container, className, { [styles.transparent]: transparent })}>
      {title && <h3 className={styles.title}>{title}</h3>}
      {description && <div className={styles.description}>{description}</div>}
      <div className={styles.extraContent}>{extraContent}</div>
      {(onClick || href) && <Button
        href={href} className={classNames(styles.button, {
          [styles.buttonTransparent]: transparentButton
        })} transparent={transparentButton} onClick={_ => onClick && onClick()}
      >{buttonTitle}
      </Button>}
    </div>
  }
}

export default ActionBlock
