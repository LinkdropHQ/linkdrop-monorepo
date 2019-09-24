/* global gapi */
import config from 'app.config.js'
import { removeUserData } from 'helpers'
import { getHashVariables } from '@linkdrop/commons'
import EventEmitter from 'events'

class GoogleApiService {
  constructor () {
    this.eventEmitter = new EventEmitter()
    this.auth2 = null
    this.loaded = false
  }

  load () {
    return new Promise((resolve, reject) => {
      if (this.loaded) {
        return resolve(true)
      }

      this._loadScriptToDom()

      this.eventEmitter.on('google-api-inited', _ => {
        resolve(true)
      })
    })
  }

  hasDrivePermissions () {
    const authInstance = gapi.auth2.getAuthInstance()
    const isSignedIn = authInstance.isSignedIn.get()
    if (!isSignedIn) {
      throw new Error('User not signed in')
    }
    const user = authInstance.currentUser.get()
    const scopes = user.getGrantedScopes()
    const hasPermission = scopes.indexOf('https://www.googleapis.com/auth/drive.appdata') > -1
    return hasPermission
  }

  async enableDrivePermissions () {
    const authInstance = gapi.auth2.getAuthInstance()
    const isSignedIn = authInstance.isSignedIn.get()
    if (!isSignedIn) {
      throw new Error('User not signed in')
    }
    const user = authInstance.currentUser.get()
    const options = new gapi.auth2.SigninOptionsBuilder({ scope: config.authScopeDrive })
    try {
      await user.grant(options)
      return true
    } catch (err) {
      console.log('Error while asking for Google Drive persmissions: ', err)
    }
  }

  fetchFiles () {
    return new Promise(async (resolve, reject) => {
      try {
        // ask for google drive permissions
        const response = await gapi.client.drive.files.list({
          spaces: 'appDataFolder'
        })

        const files = response.result.files.filter(file => file.name === 'linkdrop-data.json')
        if (files && files.length > 0) {
          const id = files[0].id
          gapi.client.drive.files
            .get({
              fileId: id,
              alt: 'media'
            })
            .execute(response => {
              resolve({ success: true, data: { ...response } })
            })
        } else {
          resolve({ success: false, data: {} })
        }
      } catch (error) {
        console.log(JSON.stringify({ message: 'fail', value: error }))
        reject(error)
      }
    })
  }

  getEmailAndAvatar () {
    const authInstance = gapi.auth2.getAuthInstance()
    const isSignedIn = authInstance.isSignedIn.get()
    if (!isSignedIn) {
      throw new Error('User not signed in')
    }
    const user = authInstance.currentUser.get()
    const email = user.getBasicProfile().getEmail()
    const avatar = user.getBasicProfile().getImageUrl()
    return { email, avatar }
  }

  uploadFiles ({ ens, contractAddress, privateKey, chainId }) {
    return new Promise((resolve, reject) => {
      const boundary = '-------314159265358979323846'
      const delimiter = '\r\n--' + boundary + '\r\n'
      const closeDelim = '\r\n--' + boundary + '--'
      const contentType = 'application/json'
      this.fetchFiles({ chainId }).then(data => {
        const metadata = {
          name: 'linkdrop-data.json',
          mimeType: contentType,
          parents: ['appDataFolder']
        }
        const updatedData = JSON.stringify({ ...data.data, result: undefined, [`_${chainId}`]: { ens, contractAddress, privateKey } })
        const multipartRequestBody =
              delimiter +
              'Content-Type: application/json\r\n\r\n' +
              JSON.stringify(metadata) +
              delimiter +
              'Content-Type: ' +
              contentType +
              '\r\n\r\n' +
              updatedData +
              closeDelim

        try {
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
              resolve({ success: true, data: { privateKey, contractAddress, ens } })
            })
        } catch (err) {
          reject(err)
        }
      })
    })
  }

  async signIn () {
    if (this.auth2) {
      await this.auth2.signIn()
      return true
    }
  }

  _loadScriptToDom () {
    if (!this.loaded) {
      this.loaded = true
      const script = document.createElement('script')
      script.setAttribute('src', 'https://apis.google.com/js/api.js')
      script.setAttribute('async', true)
      script.onload = _ => this._handleClientLoad()
      script.onreadystatechange = function () {
        if (this.readyState === 'complete') this.onload()
      }
      document.body.appendChild(script)
    }
  }

  _handleClientLoad () {
    gapi.load('client:auth2', _ => {
      this.auth2 = gapi.auth2.init({
        clientId: config.authClientId
      })
      gapi.client.init({
        clientId: config.authClientId,
        apiKey: config.authApiKey,
        discoveryDocs: config.authDiscoveryDocs,
        scope: config.authScopeDrive
      })
      console.log('gapi client inited')

      this.eventEmitter.emit('google-api-inited')
    })
  }

  signOut () {
    var auth2 = gapi.auth2.getAuthInstance()
    const {
      chainId = config.defaultChainId
    } = getHashVariables()
    auth2.signOut().then(function () {
      auth2.disconnect()
      removeUserData({ chainId })
      window.location.reload(true)
    })
  }
}

const gapiService = new GoogleApiService()
export default gapiService
