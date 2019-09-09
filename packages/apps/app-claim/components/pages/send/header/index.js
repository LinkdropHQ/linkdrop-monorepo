import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Input, Button, Icons } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import variables from 'variables'
import { prepareRedirectUrl } from 'helpers'

@actions(({ user: { loading, contractAddress }, tokens: { transactionStatus, transactionId }, assets: { items } }) => ({ transactionStatus, transactionId, items, loading, contractAddress }))
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
    if (status != null && status === 'sent' && prevStatus === null) {
      this.setState({
        finished: true
      }, _ => {
        this.actions().tokens.setTransactionStatus({ transactionStatus: null })
        this.finishTimeout = window.setTimeout(_ => this.setState({
          finished: false
        }, _ => {
          window.location.href = '/#/'
        }), 3000)
      })
    }
  }

  componentWillUnmount () {
    this.finishTimeout && window.clearTimeout(this.finishTimeout)
  }

  render () {
    const { sendTo, onSend, amount, onChange, loading, error, transactionId } = this.props
    const { finished } = this.state
    return <div className={classNames(styles.container, { [styles.loading]: loading && !transactionId })}>
      <div className={styles.content}>
        <div
          className={styles.close} onClick={_ => {
            if (loading && !transactionId) { return }
            window.location.href = prepareRedirectUrl({ link: '/#/' })
          }}
        >
          <Icons.Cross />
        </div>
        <div className={styles.amount}>
          <Input
            type='number'
            numberInput
            placeholder='0'
            value={amount}
            disabled={loading}
            onChange={({ value }) => onChange({ amount: value })}
            className={classNames(styles.input, {
              [styles.empty]: amount === null || Number(amount) === 0,
              [styles.errored]: error && error === this.t('errors.balance')
            })}
          />
        </div>
        <div className={styles.controls}>
          {this.renderButton({ error, loading, sendTo, amount, onSend, finished })}
        </div>
      </div>
    </div>
  }

  renderButton ({ loading, sendTo, amount, onSend, finished, error }) {
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
      disabled={error || !sendTo || sendTo.length === 0 || Number(amount) === 0 || loading}
      className={styles.button}
      onClick={_ => onSend && onSend()}
    >
      {this.t('buttons.send')}
    </Button>
  }
}

export default Header
