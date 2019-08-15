import React from 'react'
import styles from './styles.module.scss'
import text from 'texts'

const MobileDisabled = () => <div className={styles.container}>
  <div className={styles.header}>{text('common.mobileDisabled.titles.dashboard')}</div>
  <div className={styles.content} dangerouslySetInnerHTML={{ __html: text('common.mobileDisabled.texts.instruction') }} />
</div>

export default MobileDisabled
