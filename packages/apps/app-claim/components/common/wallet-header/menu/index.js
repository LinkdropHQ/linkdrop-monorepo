import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module'
import text from 'texts'
import { actions } from 'decorators'
import variables from 'variables'
import { prepareRedirectUrl } from 'helpers'
import gapiService from 'data/api/google-api'

@actions(({ user: { sdk } }) => ({ sdk }))
class Menu extends React.Component {
  componentDidMount () {
    gapiService.load()
  }

  render () {
    const MENU = [
      {
        title: text('common.walletHeader.menu.buyTokens'),
        href: prepareRedirectUrl({ link: '/#/buy-tokens' }),
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
          gapiService.signOut()
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

// Menu.propTypes = {
//   items: PropTypes.array.isRequired
// }

export default Menu
