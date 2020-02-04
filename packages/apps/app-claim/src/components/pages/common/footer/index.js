import React from 'react'
import styles from './styles.module'
import { translate } from 'decorators'

@translate('components.common.footer')
class Footer extends React.Component {

	render () {
		return <footer className={styles.container}>
			<div className={styles.title0x}>
				{this.t('titles.zeroExpo')}
			</div>
			<a
				href='https://linkdrop.io'
				dangerouslySetInnerHTML={{
					__html: this.t('titles.copyright')
				}}
			/>
		</footer>
	}
}

export default Footer