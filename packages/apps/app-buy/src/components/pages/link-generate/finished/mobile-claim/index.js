import React from 'react'
import styles from './styles.module'
import { getHashVariables } from '@linkdrop/commons'

class MobileClaim extends React.Component {
	render () {
			const { link } = getHashVariables()
			const iframeSrc = decodeURIComponent(link)
			return <div className={styles.claimContainer}>
			<iframe
	      frameBorder='0'
	      height='100%'
	      src={iframeSrc}
	      width='100%'
	    >
	      <p>Your browser does not support iframes.</p>
	    </iframe>
	  </div>
	}
}
export default MobileClaim