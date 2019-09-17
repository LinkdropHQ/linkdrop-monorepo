/* global gapi */
import React from 'react'
import { Button, RetinaImage, Icons } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { Page } from 'components/pages'
import { getEns, getImages } from 'helpers'
import { actions, translate } from 'decorators'
import config from 'app.config.js'
import { getHashVariables } from '@linkdrop/commons'
import classNames from 'classnames'

@actions(({ user: { sdk, privateKey, contractAddress, ens, loading } }) => ({ loading, sdk, contractAddress, privateKey, ens }))
@translate('pages.authorization')
class Authorization extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enableAuthorize: false,
      authorized: false
    }
  }

  componentDidMount () {
    this.actions().user.createWallet()
  }

  componentWillReceiveProps ({ privateKey, contractAddress }) {
    const { contractAddress: prevContractAddress, privateKey: prevPrivateKey } = this.props
    if (privateKey && contractAddress && !prevContractAddress && !prevPrivateKey) {
      const script = document.createElement('script')
      script.setAttribute('src', 'https://apis.google.com/js/api.js')
      script.setAttribute('async', true)
      script.onload = _ => this.handleClientLoad()
      script.onreadystatechange = function () {
        if (this.readyState === 'complete') this.onload()
      }
      document.body.appendChild(script)
    }
  }

  handleClientLoad () {
    gapi.load('client:auth2', _ => this.initClient())
  }

  initClient () {
    gapi.client.init({
      clientId: config.authClientId,
      apiKey: config.authApiKey,
      discoveryDocs: config.authDiscoveryDocs,
      // scope: `${config.authScopeDrive} ${config.authScopeContacts}`
      fetch_basic_profile: false,
      scope: 'profile'
    })

    const authInstance = gapi.auth2.getAuthInstance()
    authInstance.isSignedIn.listen(_ => {
      this.updateSigninStatus({ authInstance })
    })
    // Handle the initial sign-in state.
    this.setState({
      enableAuthorize: true
    })
  }

  updateSigninStatus ({ authInstance }) {
    if (!authInstance) { return }
    const isSignedIn = authInstance.isSignedIn.get()
    if (isSignedIn) {
      this.setState({
        authorized: true
      })
    }
  }

  getFiles () {
    const authInstance = gapi.auth2.getAuthInstance()
    const {
      chainId
    } = getHashVariables()
    const isSignedIn = authInstance.isSignedIn.get()
    if (isSignedIn) {
      const user = authInstance.currentUser.get()
      const email = user.getBasicProfile().getEmail()
      const avatar = user.getBasicProfile().getImageUrl()
      const options = new gapi.auth2.SigninOptionsBuilder({ scope: config.authScopeDrive })
      user.grant(options).then(
        (success) => {
          gapi.client.drive.files.list({
            spaces: 'appDataFolder'
          }).then(response => {
            const files = response.result.files.filter(file => file.name === 'linkdrop-data.json')
            if (files && files.length > 0) {
              const id = files[0].id
              gapi.client.drive.files
                .get({
                  fileId: id,
                  alt: 'media'
                })
                .execute(response => {
                  const { privateKey, contractAddress, ens } = response
                  this.actions().user.setUserData({ privateKey, contractAddress, ens, avatar })
                })
            } else {
              const ens = getEns({ email, chainId })
              const { contractAddress, privateKey } = this.props
              const boundary = '-------314159265358979323846'
              const delimiter = '\r\n--' + boundary + '\r\n'
              const closeDelim = '\r\n--' + boundary + '--'

              const contentType = 'application/json'

              const metadata = {
                name: 'linkdrop-data.json',
                mimeType: contentType,
                parents: ['appDataFolder']
              }

              const multipartRequestBody =
                delimiter +
                'Content-Type: application/json\r\n\r\n' +
                JSON.stringify(metadata) +
                delimiter +
                'Content-Type: ' +
                contentType +
                '\r\n\r\n' +
                JSON.stringify({ ens, contractAddress, privateKey }) +
                closeDelim

              gapi.client
                .request({
                  path: '/upload/drive/v3/files',
                  method: 'POST',
                  params: { uploadType: 'multipart' },
                  headers: {
                    'Content-Type':
              'multipart/related; boundary="' + boundary + '"'
                  },
                  body: multipartRequestBody
                })
                .execute(response => {
                  this.actions().user.setUserData({ privateKey, contractAddress, ens, avatar })
                })
            }
          })
        },
        function (fail) {
          console.log(JSON.stringify({ message: 'fail', value: fail }))
        })
    }
  }

  renderGoogleDriveScreen () {
    return <div className={styles.container}>
      <h2 className={classNames(styles.title, styles.titleGrant)} dangerouslySetInnerHTML={{ __html: this.t('titles.grantGoogleDrive') }} />
      <ul className={styles.list}>
        <li className={styles.listItem}><Icons.CheckSmall />{this.t('texts.googelDrive._1')}</li>
        <li className={styles.listItem}><Icons.CheckSmall />{this.t('texts.googelDrive._2')}</li>
        <li className={styles.listItem}><Icons.CheckSmall />{this.t('texts.googelDrive._3')}</li>
      </ul>
      <Button className={styles.button} inverted onClick={e => this.getFiles(e)}>
        <RetinaImage width={30} {...getImages({ src: 'gdrive' })} />
        {this.t('titles.grantAccess')}
      </Button>
    </div>
  }

  handleAuthClick () {
    const authInstance = gapi.auth2.getAuthInstance()
    authInstance.signIn().then(() => {
      this.updateSigninStatus({ authInstance })
    })
  }

  renderAuthorizationScreen () {
    const { loading } = this.props
    const { enableAuthorize } = this.state
    return <div className={styles.container}>
      <h2 className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.signIn') }} />
      <Button loadingClassName={styles.buttonLoading} className={styles.button} inverted loading={!enableAuthorize || loading} onClick={e => this.handleAuthClick(e)}>
        <RetinaImage width={30} {...getImages({ src: 'google' })} />
        {this.t('titles.googleSignIn')}
      </Button>
      <div className={styles.note} dangerouslySetInnerHTML={{ __html: this.t('texts.backup', { href: 'https://www.notion.so/linkdrop/Help-Center-9cf549af5f614e1caee6a660a93c489b#d0a28202100d4512bbeb52445e6db95b' }) }} />
    </div>
  }

  render () {
    const { authorized } = this.state
    return <Page dynamicHeader disableProfile>
      {authorized ? this.renderGoogleDriveScreen() : this.renderAuthorizationScreen()}
    </Page>
  }
}
export default Authorization
