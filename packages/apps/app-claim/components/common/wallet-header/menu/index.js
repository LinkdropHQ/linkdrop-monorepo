/* global gapi */
import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module'
import text from 'texts'
import { actions } from 'decorators'
import config from 'app.config.js'
import variables from 'variables'
import { prepareRedirectUrl } from 'helpers'

let gapiObj
try {
  gapiObj = gapi
} catch (e) {
  gapiObj = false
}

@actions(({ user: { sdk } }) => ({ sdk }))
class Menu extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      gapiObj
    }
  }

  // componentDidMount () {
  //   if (!gapiObj) {
  //     const script = document.createElement('script')
  //     script.setAttribute('src', 'https://apis.google.com/js/api.js')
  //     script.setAttribute('async', true)
  //     script.onload = _ => this.handleClientLoad()
  //     script.onreadystatechange = function () {
  //       if (this.readyState === 'complete') this.onload()
  //     }
  //     document.body.appendChild(script)
  //   }
  // }

  handleClientLoad () {
    gapi.load('client:auth2', _ => this.initClient())
  }

  initClient () {
    // return gapi.auth2.getAuthInstance().signOut()
    gapi.client.init({
      clientId: config.authClientId,
      apiKey: config.authApiKey,
      discoveryDocs: config.authDiscoveryDocs,
      // scope: `${config.authScopeDrive} ${config.authScopeContacts}`
      scope: config.authScopeDrive
    }).then(_ => {
      // Listen for sign-in state changes.
      this.setState({
        gapiObj: gapi
      })
    }, error => {
      console.error(error)
    })
  }

  render () {
    const { gapiObj } = this.state
    const MENU = [
      {
        title: text('common.walletHeader.menu.buyTokens'),
        onClick: _ => this.actions().user.setMoonpayShow({ moonpayShow: true }),
        color: variables.greenColor,
        logo: '$'
      }, {
        title: text('common.walletHeader.menu.withdraw'),
        href: prepareRedirectUrl({ link: '/#/send' })
      }, {
        title: text('common.walletHeader.menu.support'),
        onClick: _ => window.open('https://t.me/LinkdropHQ', '_blank')
      }, {
        title: text('common.walletHeader.menu.legal'),
        onClick: _ => window.open('https://www.notion.so/Terms-and-Privacy-dfa7d9b85698491d9926cbfe3c9a0a58', '_blank')
      }, {
        title: text('common.walletHeader.menu.logOut'),
        onClick: _ => {
          if (gapiObj) {
            var auth2 = gapiObj.auth2.getAuthInstance()
            auth2.signOut().then(function () {
              auth2.disconnect()
              localStorage.clear()
              location.reload(true)
            })
          }
        },
        color: variables.redColor
      }
    ]
    return <div className={styles.container}>
      {MENU.map(({ title, href, onClick, color, logo }) => {
        const style = color ? { color } : {}
        if (href) {
          return <a
            style={style}
            key={title}
            href={href}
            className={styles.menuItem}
          >
            {logo && <div className={styles.menuItemLogo}>{logo}</div>}
            {title}
          </a>
        }
        return <div
          style={style}
          onClick={_ => onClick && onClick()}
          key={title}
          className={styles.menuItem}
        >
          {logo && <div className={styles.menuItemLogo}>{logo}</div>}
          {title}
        </div>
      })}
    </div>
  }
}

Menu.propTypes = {
  items: PropTypes.array.isRequired
}

export default Menu
