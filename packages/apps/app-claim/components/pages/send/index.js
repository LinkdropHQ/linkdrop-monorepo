import React from 'react'
import { translate, actions } from 'decorators'
import { Page } from 'components/pages'
import styles from './styles.module'
import Header from './header'
import Assets from './assets'
import Input from './input'
import Contacts from './contacts'
import { getHashVariables } from '@linkdrop/commons'
import { Scrollbars } from 'react-custom-scrollbars'

@actions(({ user: { loading, contractAddress }, assets: { items } }) => ({ items, loading, contractAddress }))
@translate('pages.send')
class Send extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      sendTo: ''
    }
  }

  componentDidMount () {
    const { items } = this.props
    const {
      chainId
    } = getHashVariables()
    if (!items || items.length === 0) {
      this.actions().assets.getItems({ chainId })
    }
  }

  render () {
    const { sendTo } = this.state
    return <div className={styles.container}>
      <Header sendTo={sendTo} />
      <Scrollbars style={{
        heigth: 'calc(100vh - 90px)',
        width: '100%'
      }}
      >
        <div className={styles.content}>
          <Assets />
          <Input
            onChange={({ value }) => this.setState({
              sendTo: value
            })}
            value={sendTo}
            title={this.t('titles.to')}
            placeholder={this.t('titles.toPlaceholder')}
          />
          {false && <Input title={this.t('titles.for')} placeholder={this.t('titles.forPlaceholder')} />}
          {false && <Contacts />}
        </div>
      </Scrollbars>
    </div>
  }
}

export default Send
