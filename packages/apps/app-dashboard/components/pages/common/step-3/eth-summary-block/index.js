import React from 'react'
import styles from './styles.module'

export default ({ ethToDistribute, serviceFee, ethTotal, text }) => {
  return <div className={styles.container}>
    <div className={styles.title} dangerouslySetInnerHTML={{ __html: text('texts._15', { eth: ethTotal }) }} />
    <div className={styles.body}>
      {ethToDistribute > 0 && <div className={styles.data} dangerouslySetInnerHTML={{ __html: text('texts._16', { eth: ethToDistribute }) }} />}
      <div className={styles.data} dangerouslySetInnerHTML={{ __html: text('texts._17', { eth: serviceFee }) }} />
    </div>
  </div>
}
