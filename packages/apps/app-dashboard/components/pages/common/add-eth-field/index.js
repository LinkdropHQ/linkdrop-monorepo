import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Button, Input } from 'components/common'
import { Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import variables from 'variables'
import { defineDefaultSymbol } from 'helpers'

@actions(({ user: { chainId } }) => ({ chainId }))
@translate('pages.campaignCreate')
class AddEthField extends React.Component {
  constructor (props) {
    super(props)
    const { chainId } = props
    this.defaultSymbol = defineDefaultSymbol({ chainId })
  }

  render () {
    const { addEth, ethAmount, tokenType, setField, noMargin, chainId } = this.props
    if (tokenType === 'eth') return null
    if (!addEth) {
      return <div className={classNames(styles.ethAddButton, {
        [styles.noMargin]: noMargin
      })}
      >
        <Button
          transparent
          className={styles.extraButton}
          onClick={_ => setField({ field: 'addEth', value: true })}
        >
          {this.t('buttons.addEth', { symbol: this.defaultSymbol })}
        </Button>
      </div>
    }
    return <div
      ref={node => { this.container = node }} className={classNames(styles.ethAddInput, {
        [styles.noMargin]: noMargin
      })}
    >
      {!noMargin && <span>+</span>}
      <Input
        numberInput
        suffix={this.defaultSymbol}
        className={styles.ethInput}
        value={ethAmount || 0}
        onChange={({ value }) => {
          const limit = noMargin ? 8 : 6
          this.container
            .style
            .width = `${value.length > limit ? (150 + (value.length * 6)) : 150}px`
          setField({ field: 'ethAmount', value: parseFloat(value) })
        }}
      />
      <Icons.CloseButton
        fill={variables.dbBlue}
        onClick={_ => setField({ field: 'addEth', value: false })}
      />
    </div>
  }
}

export default AddEthField
