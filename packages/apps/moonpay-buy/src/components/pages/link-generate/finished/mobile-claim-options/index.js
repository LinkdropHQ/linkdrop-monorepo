import React from 'react'
import styles from './styles.module.scss'
import { translate, platform, actions } from 'decorators'
import { PageExpandable } from 'components/pages'
import { Button } from 'components/common'
import { RetinaImage } from '@linkdrop/ui-kit'
import { getWalletData, getWalletLink, getImages, getParentHost } from 'helpers'
import wallets from 'wallets'

@actions(({ link: { link } }) => ({ link }))
@platform()
@translate('pages.linkGenerate')
class MobileClaimOptions extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			currentWallet: 'trust'
		}
	}

	render () {
		const { onChange, expanded, link } = this.props
		const { currentWallet } = this.state
		
		const currentUrl = getParentHost()
		// const redirectUrl = `${currentUrl}/#/?link=${encodeURIComponent(link)}`
		const redirectUrl = link
		const walletData = getWalletData({ wallet: currentWallet })
		const walletLink = getWalletLink({ wallet: currentWallet, platform: this.platform, currentUrl: redirectUrl })
		return <PageExpandable
		  expanded={expanded}
		  fullContent
		  onClose={_ => onChange && onChange(!expanded)}
		>
			<div
				className={styles.title}
				dangerouslySetInnerHTML={{ __html: this.t('titles.needAWallet') }}
			/>
			<div className={styles.content}>
				{this.renderWalletIcon({ wallet: currentWallet })}
				{this.renderWalletButton({ walletData, walletLink })}
			</div>
		</PageExpandable>
	}

	renderIcon ({ wallet }) {
    let imageId = wallet
    if (wallet === 'opera') {
      if (this.platform === 'ios') {
        imageId = 'opera-touch'
      }
    }
    return <RetinaImage width={60} {...getImages({ src: imageId })} />
  }


	renderWalletIcon ({ wallet }) {
		const icon = this.renderIcon({ wallet })
		return <div className={styles.icon}>
			{icon}
		</div>
	}

	renderWalletButton ({ walletData, walletLink }) {
		return <Button href={walletLink}>{walletData.name}</Button>
	}
}

export default MobileClaimOptions