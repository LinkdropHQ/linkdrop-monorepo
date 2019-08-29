import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Input, Button, Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import variables from 'variables'

@actions(({ user: { loading, contractAddress }, tokens: { transactionStatus }, assets: { items } }) => ({ transactionStatus, items, loading, contractAddress }))
@translate('pages.send')
class Header extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      finished: false
    }
  }

  componentWillReceiveProps ({ transactionStatus: status }) {
    const { transactionStatus: prevStatus } = this.props
    if (status != null && status === 'finished' && prevStatus === null) {
      this.setState({
        finished: true
      }, _ => window.setTimeout(_ => this.setState({
        finished: false
      }), 3000))
    }
  }

  render () {
    const { sendTo, onSend, amount, onChange, loading } = this.props
    const { finished } = this.state
    return <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.close} onClick={_ => { window.location.href = '/#/' }}>
          <Icons.Cross />
        </div>
        <div className={styles.amount}>
          <Input
            numberInput
            value={amount}
            disabled={loading}
            onChange={({ value }) => onChange({ amount: value })}
            className={classNames(styles.input, {
              [styles.empty]: Number(amount) === 0
            })}
          />
        </div>
        <div className={styles.controls}>
          {this.renderButton({ loading, sendTo, amount, onSend, finished })}
        </div>
      </div>
    </div>
  }

  renderButton ({ loading, sendTo, amount, onSend, finished }) {
    if (finished) {
      return <Button
        disabled
        className={styles.finishedButton}
      >
        <Icons.CheckSmall fill={variables.greenColor} stroke={variables.greenColor} />
      </Button>
    }
    return <Button
      loading={loading}
      disabled={!sendTo || sendTo.length === 0 || Number(amount) === 0 || loading}
      className={styles.button}
      onClick={_ => onSend && onSend()}
    >
      {this.t('buttons.pay')}
    </Button>
  }
}

export default Header
