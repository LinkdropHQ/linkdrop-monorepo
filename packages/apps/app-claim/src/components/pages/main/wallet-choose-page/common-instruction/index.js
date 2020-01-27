import React from 'react'

export default ({ walletType, t, styles, title, href }) => {
  return <div className={styles.instructions}>
    {!href || typeof href === 'object' ? <div dangerouslySetInnerHTML={{
      __html: t('walletsInstructions.common._1.withNoUrl', {
        title
      })
    }} /> : <div dangerouslySetInnerHTML={{
      __html: t('walletsInstructions.common._1.withUrl', {
        href,
        title
      })
    }} />}
    <div dangerouslySetInnerHTML={{ __html: t('walletsInstructions.common._2') }} />
  </div>
}
