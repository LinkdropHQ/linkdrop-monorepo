import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Button, Input } from 'components/common'
import { Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import variables from 'variables'

@actions(_ => ({}))
@translate('pages.campaignCreate')
class AddEthField extends React.Component {
  render () {
    const { addEth, ethAmount, tokenType, setField, noMargin } = this.props
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
          {this.t('buttons.addEth')}
        </Button>
      </div>
    }
    return <div className={classNames(styles.ethAddInput, {
      [styles.noMargin]: noMargin
    })}
    >
      {!noMargin && <span>+</span>}
      <Input
        numberInput
        suffix='ETH'
        className={styles.ethInput}
        value={ethAmount || 0}
        onChange={({ value }) => setField({ field: 'ethAmount', value: parseFloat(value) })}
      />
      <Icons.CloseButton
        fill={variables.dbBlue}
        onClick={_ => setField({ field: 'addEth', value: false })}
      />
    </div>
  }
}

export default AddEthField
