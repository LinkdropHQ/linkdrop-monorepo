/* global gapi */
import React from 'react'
import { Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { Page } from 'components/pages'
import { getEns } from 'helpers'
import { action } from 'decorators'

@action(({ user: { sdk, privateKey, contractAddress, ens, loading } }) => ({ loading, sdk, contractAddress, privateKey, ens }))
class Authorization extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enableAuthorize: true
    }
  }

  componentDidMount () {
    this.actions().user.createWallet()
  }

  componentWllReceiveProps ({ privateKey, contractAddress }) {
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
    // return gapi.auth2.getAuthInstance().signOut()
    gapi.client.init(CONFIGS).then(_ => {
      // Listen for sign-in state changes.
      const authInstance = gapi.auth2.getAuthInstance()
      authInstance.isSignedIn.listen(isSignedIn => this.updateSigninStatus({ authInstance }))
      // Handle the initial sign-in state.
      this.updateSigninStatus({ authInstance })
    }, error => {
      console.error(error)
    })
  }

  updateSigninStatus ({ authInstance }) {
    const isSignedIn = authInstance.isSignedIn.get()
    const email = authInstance.currentUser.get().getBasicProfile().getEmail()
    this.setState({
      enableAuthorize: !isSignedIn,
      email
    }, _ => {
      if (isSignedIn) {
        this.getFiles({ email })
      }
    })
  }

  getFiles ({ email }) {
    const ens = getEns({ email })
    gapi.client.drive.files.list({
      spaces: 'appDataFolder'
    }).then(function (response) {
      const files = response.result.files.filter(file => file.name === 'linkdrop-data.json')
      if (files && files.length > 0) {
        const id = files[0].id
        gapi.client.drive.files
          .get({
            fileId: id,
            alt: 'media'
          })
          .execute(response => {
            console.log('Found existing linkdrop-data.json file with id:', id)
            const { privateKey, contractAddress } = response
            this.actions().user.setUserData({ privateKey, contractAddress, ens })
          })
      } else {
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
            console.log('Created new file with id:', response.id)
            this.actions().user.setUserData({ privateKey, contractAddress, ens })
          })
      }
    })
  }

  handleAuthClick () {
    gapi.auth2.getAuthInstance().signIn()
  }

  render () {
    const { loading } = this.props
    const { enableAuthorize } = this.state
    return <Page>
      <div className={styles.container}>
        <Button disabled={!enableAuthorize || loading} onClick={e => this.handleAuthClick(e)}>Login</Button>
      </div>
    </Page>
  }
}
export default Authorization

const CONFIGS = {
  clientId: '564195565285-h32e6aphhqkfltldst6khjf4tjg671jj.apps.googleusercontent.com',
  apiKey: 'AIzaSyDiPi5V_R2OEy6fbIaQrbtGtUIfEfoG2rk',
  discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
  scope: 'https://www.googleapis.com/auth/drive.appdata'
}
