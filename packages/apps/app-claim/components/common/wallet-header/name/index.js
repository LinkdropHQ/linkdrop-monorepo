import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module'
import config from 'config-claim'

const Name = ({ ens = '', chainId }) => <a className={styles.container} target='_blank' href={`${chainId === '4' ? config.etherscanRinkeby : config.etherscanMainnet}address/${ens}`}>
  {ens}
</a>

Name.propTypes = {
  ens: PropTypes.string.isRequired
}

export default Name
