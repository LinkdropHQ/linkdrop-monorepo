import React from 'react'
import { Button, RetinaImage, Icons } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { Page } from 'components/pages'
import { getEns, getImages } from 'helpers'
import { actions, translate } from 'decorators'
import { getHashVariables } from '@linkdrop/commons'
import classNames from 'classnames'
import gapiService from 'data/api/google-api'

@actions(({ user: { sdk, privateKey, contractAddress, ens, loading, chainId } }) => ({
  loading,
  sdk,
  contractAddress,
  privateKey,
  ens,
  chainId
}))
@translate('pages.authorization')
class Authorization extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      enableAuthorize: false,
      authorized: false,
      accessingDrive: false
    }
  }

  componentDidMount () {
    this.actions().user.createWallet()
    this._loadGoogleApi()
  }

  componentWillReceiveProps ({ privateKey, contractAddress }) {
    const { contractAddress: prevContractAddress, privateKey: prevPrivateKey } = this.props
    if (privateKey && contractAddress && !prevContractAddress && !prevPrivateKey) {
      // load google api
      this._loadGoogleApi()
    }
  }

  async _loadGoogleApi () {
    await gapiService.load()
    // Handle the initial sign-in state.
    this.setState({
      enableAuthorize: true
    })
  }

  async _syncPrivateKeyWithDrive () {
    const {
      chainId
    } = this.props
    const { email, avatar } = gapiService.getEmailAndAvatar()

    // fetching files from Drive
    const fetchResult = await gapiService.fetchFiles({ chainId })
    let data
    if (fetchResult.success && fetchResult.data[`_${chainId}`]) {
      data = fetchResult.data[`_${chainId}`]
    } else { // if no files on drive upload new ones
      const ens = getEns({ email, chainId })
      const { contractAddress, privateKey } = this.props
      const uploadResult = await gapiService.uploadFiles({ chainId, ens, contractAddress, privateKey })
      data = uploadResult.data
    }
    const { privateKey, contractAddress, ens } = data
    this.actions().user.setUserData({ privateKey, contractAddress, ens, avatar, chainId })
  }

  async _enableDrivePermissions () {
    try {
      this.setState({ accessingDrive: true })
      await gapiService.enableDrivePermissions()
      await this._syncPrivateKeyWithDrive()
      this.setState({ accessingDrive: false })
    } catch (err) {
      this.setState({ accessingDrive: false })
      console.log('Error while enabling Drive permissions: ', err)
    }
  }

  renderGoogleDriveScreen () {
    const { accessingDrive } = this.state
    return <div className={styles.container}>
      <h2 className={classNames(styles.title, styles.titleGrant)} dangerouslySetInnerHTML={{ __html: this.t('titles.grantGoogleDrive') }} />
      <ul className={styles.list}>
        <li className={styles.listItem}><Icons.CheckSmall />{this.t('texts.googelDrive._1')}</li>
        <li className={styles.listItem}><Icons.CheckSmall />{this.t('texts.googelDrive._2')}</li>
        <li className={styles.listItem}><Icons.CheckSmall />{this.t('texts.googelDrive._3')}</li>
      </ul>
      <Button className={styles.button} loading={accessingDrive} inverted onClick={_ => this._enableDrivePermissions()}>
        <RetinaImage width={30} {...getImages({ src: 'gdrive' })} />
        {this.t('titles.grantAccess')}
      </Button>
    </div>
  }

  async handleAuthClick () {
    const isSignedIn = await gapiService.signIn()
    if (isSignedIn) {
      // if has drive permissions sync with it immediately
      if (gapiService.hasDrivePermissions()) {
        await this._syncPrivateKeyWithDrive()
      } else {
        // otherwise show screen to enable permissions
        this.setState({
          authorized: true
        })
      }
    }
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
