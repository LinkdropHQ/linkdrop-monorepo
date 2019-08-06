import React from 'react'
import styles from './styles.module'
import text from 'texts'

const Footer = _ => <div className={styles.container} dangerouslySetInnerHTML={{ __html: text('common.walletHeader.texts.footer') }} />

export default Footer
