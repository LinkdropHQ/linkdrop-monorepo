import React from 'react'
import styles from './styles.module'

export default ({ ethToDistribute, symbol, serviceFee, ethTotal, text }) => {
  return <div className={styles.container}>
    <div className={styles.title} dangerouslySetInnerHTML={{ __html: text('texts._15', { symbol, eth: ethTotal }) }} />
    <div className={styles.body}>
      {ethToDistribute > 0 && <div className={styles.data} dangerouslySetInnerHTML={{ __html: text('texts._16', { symbol, eth: ethToDistribute }) }} />}
      <div className={styles.data} dangerouslySetInnerHTML={{ __html: text('texts._17', { symbol, eth: serviceFee }) }} />
    </div>
  </div>
}
