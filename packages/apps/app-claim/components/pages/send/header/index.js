import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Input, Button, Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'

@actions(({ user: { loading, contractAddress }, assets: { items } }) => ({ items, loading, contractAddress }))
@translate('pages.send')
class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      amount: 0
    }
  }

  render () {
    const { sendTo, onSend } = this.props
    const { amount } = this.state
    return <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.close} onClick={_ => { window.location.href = '/#/' }}>
          <Icons.Cross />
        </div>
        <div className={styles.amount}>
          <Input
            numberInput
            value={amount}
            onChange={({ value }) => this.setState({ amount: value })}
            className={classNames(styles.input, {
              [styles.empty]: Number(amount) === 0
            })}
          />
        </div>
        <div className={styles.controls}>
          <Button
            disabled={!sendTo || sendTo.length === 0 || Number(amount) === 0}
            className={styles.button}
            onClick={_ => onSend && onSend({ amount })}
          >
            {this.t('buttons.pay')}
          </Button>
        </div>
      </div>
    </div>
  }
}

export default Header
