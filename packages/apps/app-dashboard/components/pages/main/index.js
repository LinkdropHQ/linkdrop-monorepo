import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { ActionBlock } from 'components/common'

@actions(({ user: { currentAddress }, campaigns: { items } }) => ({ currentAddress, items }))
@translate('pages.main')
class Main extends React.Component {
  render () {
    return <div className={styles.container}>
      <ActionBlock
        title={this.t('titles.erc20Campaign')}
        description={this.t('texts.listOfLinks')}
        extraContent={this.t('titles.erc20Eth')}
        href='/#/campaigns/create'
        buttonTitle={this.t('buttons.create')}
      />

      <ActionBlock
        title={this.t('titles.erc721Campaign')}
        description={this.t('texts.listOfLinks')}
        extraContent={this.t('titles.erc721Eth')}
        href='/#/campaigns/create'
        buttonTitle={this.t('buttons.create')}
      />

      <ActionBlock
        transparent
        title={this.t('titles.customSolutions')}
        description={this.t('texts.incentivizeCustomer')}
        extraContent={this.t('titles.allAssets')}
        onClick={_ => {
          window.open('https://linkdrop.io/contact', '_blank')
        }}
        buttonTitle={this.t('buttons.contactUs')}
      />
    </div>
  }
}

export default Main
