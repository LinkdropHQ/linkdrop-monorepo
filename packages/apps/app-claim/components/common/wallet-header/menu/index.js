import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module'

const Menu = ({ items = [] }) => <div className={styles.container}>
  {items.map(({ title, href }) => <div key={href} className={styles.menuItem}>{title}</div>)}
</div>

Menu.propTypes = {
  items: PropTypes.array.isRequired
}

export default Menu
