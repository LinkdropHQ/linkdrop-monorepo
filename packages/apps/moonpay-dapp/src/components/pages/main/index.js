import React from 'react'
import styles from './styles.module'
import { ModalWindow, Button } from 'components/common'
import { Page } from 'components/pages'
import { translate } from 'decorators'
import { applicationUrl } from 'config'
import { getHashVariables } from '@linkdrop/commons'

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
    const { link } = getHashVariables()
    const src = this.defineIframeAddress({ link })
    return <ModalWindow onClose={_ => this.setState({ showModalWindow: false })}>
      <iframe
        frameBorder='0'
        height='100%'
        src={src}
        width='100%'
      >
        <p>Your browser does not support iframes.</p>
      </iframe>
    </ModalWindow>
  }

  defineIframeAddress ({ link }) {
    if (!link) { return applicationUrl }
    return `${applicationUrl}?link=${link}`
  }
}

export default Main
