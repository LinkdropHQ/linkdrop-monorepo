import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { ActionBlock, Note } from 'components/common'
import { defineDefaultSymbol } from 'helpers'

@actions(({ user: { currentAddress, chainId }, campaigns: { items } }) => ({ chainId, currentAddress, items }))
@translate('pages.main')
class Main extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = this.props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
  }

  render () {
    const { chainId } = this.props
    return <div className={styles.container}>
      {Number(chainId) === 1 && <Note text={this.t('texts.gasPriceAttention')} />}
      <div className={styles.blocksContainer}>
        <ActionBlock
          title={this.t('titles.erc20Campaign')}
          description={this.t('texts.listOfLinks')}
          extraContent={this.t('titles.erc20Eth', { symbol: this.defaultSymbol })}
          href='/#/campaigns/create'
          buttonTitle={this.t('buttons.create')}
        />

        <ActionBlock
          title={this.t('titles.erc721Campaign')}
          description={this.t('texts.listOfLinks')}
          extraContent={this.t('titles.erc721Eth', { symbol: this.defaultSymbol })}
          href='/#/campaigns/create-erc-721'
          buttonTitle={this.t('buttons.create')}
        />

        <ActionBlock
          transparent
          transparentButton
          title={this.t('titles.customSolutions')}
          description={this.t('texts.incentivizeCustomer')}
          onClick={_ => {
            window.open('https://linkdrop.io/contact', '_blank')
          }}
          buttonTitle={this.t('buttons.contactUs')}
        />
      </div>
    </div>
  }
}

export default Main
