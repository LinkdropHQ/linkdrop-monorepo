import React from 'react'
import styles from './styles.module'
import { Loading } from '@linkdrop/ui-kit'
import { getHashVariables } from '@linkdrop/commons'

class MobileClaim extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			loading: true
		}
	}
	render () {
		const { link } = getHashVariables()
		const { loading } = this.state
		const iframeSrc = decodeURIComponent(link)
		return <div className={styles.claimContainer}>
			{loading && <Loading withOverlay />}
			<iframe
	      frameBorder='0'
	      height='100%'
	      src={iframeSrc}
	      onLoad={_ => this.setState({ loading: false })}
	      width='100%'
	    >
	      <p>Your browser does not support iframes.</p>
	    </iframe>
	  </div>
	}
}
export default MobileClaim