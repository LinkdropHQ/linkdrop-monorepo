import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'

@actions(({ campaigns: { linksAmount, items } }) => ({ linksAmount, items }))
@translate('pages.campaignCreate')
class Step6 extends React.Component {
  render () {
    const { linksAmount } = this.props
    return <div className={styles.container}>
      <div className={styles.title}>{this.t('titles.useTerminalApp')}</div>
      <div className={styles.instruction}>
        {this.t('texts.scriptInstruction')}
      </div>
      <div className={styles.styleBlock}>
        {this.t('texts.terminalApp')}
      </div>

      <div className={styles.content}>
        <div className={styles.subtitle}>{this.t('titles.cloneLinkdropMonorepo')}</div>
        <div className={styles.styleBlock}>
          git clone git@github.com:LinkdropHQ/linkdrop-monorepo.git
        </div>

        <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: this.t('titles.fillInConfig') }} />

        <xmp className={classNames(styles.styleBlock, styles.codeBlock)}>
          {this.t('texts.codeBlockScript')}
        </xmp>

        <div className={styles.styleBlock}>
          {this.t('texts.payAttention')}
        </div>

        <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: this.t('titles.generateLinks') }} />
        <div className={styles.text}>
          {this.t('texts.scriptDescription')}
        </div>

        <div className={styles.subtitle} dangerouslySetInnerHTML={{ __html: this.t('titles.csvFile') }} />
      </div>
    </div>
  }
}

export default Step6
