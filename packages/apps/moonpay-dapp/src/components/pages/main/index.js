import React from 'react'
import styles from './styles.module'
import { ModalWindow, Button } from 'components/common'
import { Page } from 'components/pages'
import { translate } from 'decorators'
import { applicationUrl } from 'config'

@translate('pages.main')
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showModalWindow: false
    }
  }

  render () {
    const { showModalWindow } = this.state
    return <Page>
      {this.renderModalWindow({ showModalWindow })}
      <div className={styles.container}>
        <Button onClick={_ => this.setState({
          showModalWindow: true
        })}
        >
          {this.t('buttons.buyTokens')}
        </Button>
      </div>
    </Page>
  }

  renderModalWindow ({ showModalWindow }) {
    if (!showModalWindow) { return null }
    return <ModalWindow onClose={_ => this.setState({ showModalWindow: false })}>
      <iframe
        frameBorder='0'
        height='100%'
        src={applicationUrl}
        width='100%'
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </ModalWindow>
  }
}

export default Main
