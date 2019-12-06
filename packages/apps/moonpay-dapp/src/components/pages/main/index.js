import React from 'react'
import styles from './styles.module'
import { ModalWindow, Button } from 'components/common'
import { Page } from 'components/pages'
import { translate } from 'decorators'
import { applicationUrl } from 'config'
import { getHashVariables } from '@linkdrop/commons'
import { Loading } from '@linkdrop/ui-kit'

@translate('pages.main')
class Main extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      showModalWindow: false,
      loaded: false
    }
  }

  render () {
    const { showModalWindow, loaded } = this.state
    return <Page>
      {this.renderModalWindow({ showModalWindow, loaded })}
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

  renderModalWindow ({ showModalWindow, loaded }) {
    if (!showModalWindow) { return null }
    const { link } = getHashVariables()
    const src = this.defineIframeAddress({ link })
    return <ModalWindow onClose={_ => this.setState({ showModalWindow: false })}>
      {!loaded && <Loading withOverlay />}
      <iframe
        frameBorder='0'
        height='100%'
        onLoad={_ => this.setState({
          loaded: true
        })}
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
