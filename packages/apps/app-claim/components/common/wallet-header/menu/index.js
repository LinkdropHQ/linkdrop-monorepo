import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module'
import text from 'texts'

const Menu = ({ items = MENU }) => <div className={styles.container}>
  {items.map(({ title, href }) => <div key={href} className={styles.menuItem}>{title}</div>)}
</div>

Menu.propTypes = {
  items: PropTypes.array.isRequired
}

export default Menu

const MENU = [
  {
    title: text('common.walletHeader.menu.followUs')
  }, {
    title: text('common.walletHeader.menu.support')
  }, {
    title: text('common.walletHeader.menu.legal')
  }
]
