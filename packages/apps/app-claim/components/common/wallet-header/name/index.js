import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module'

const Name = ({ ens = '' }) => <div className={styles.container}>
  {ens}
</div>

Name.propTypes = {
  ens: PropTypes.string.isRequired
}

export default Name
