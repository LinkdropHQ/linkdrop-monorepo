import React from 'react'
import { DappHeader } from 'components/common'
import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate, actions } from 'decorators'

@actions(({ user: { ens, contractAddress } }) => ({ ens, contractAddress }))
@translate('pages.dappConnect')
class DappConnect extends React.Component {
  render () {
    const { ens } = this.props
    return <div className={styles.container}>
      <DappHeader
        title={this.t('titles.wallet')}
        onClose={() => this.actions().widget.close()}
      />

      <div className={styles.content}>
        <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.loggedIn', { ens }) }} />
        <Button
          className={styles.button}
          onClick={() => this.actions().widget.confirm({})}
        >
          {this.t('buttons.continue')}
        </Button>
      </div>
      <div
        className={styles.footer}
        dangerouslySetInnerHTML={{ __html: this.t('texts.dapp') }}
      />
    </div>
  }
}

export default DappConnect
