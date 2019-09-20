import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module'
import { defineEtherscanUrl } from '@linkdrop/commons'

const Name = ({ ens = '', chainId }) => <a className={styles.container} target='_blank' href={`${defineEtherscanUrl({ chainId })}address/${ens}`}>
  {ens}
</a>

Name.propTypes = {
  ens: PropTypes.string.isRequired
}

export default Name
