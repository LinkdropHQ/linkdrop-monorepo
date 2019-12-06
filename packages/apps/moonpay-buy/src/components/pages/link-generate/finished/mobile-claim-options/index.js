import React from 'react'
import styles from './styles.module.scss'
import { translate, platform, actions } from 'decorators'
import { PageExpandable } from 'components/pages'
import { Button } from 'components/common'
import { RetinaImage } from '@linkdrop/ui-kit'
import { getWalletData, getWalletLink, getImages, getParentHost } from 'helpers'
import wallets from 'wallets'
import Slider from './slider'
import classNames from 'classnames'

@actions(({ link: { link } }) => ({ link }))
@platform()
@translate('pages.linkGenerate')
class MobileClaimOptions extends React.Component {
	constructor (props) {
		super(props)
		this.state = {
			currentWallet: 'trust',
			showSlider: null
		}
	}

	render () {
		const { onChange, expanded, link } = this.props
		const { currentWallet, showSlider } = this.state
		
		const currentUrl = getParentHost()
		const redirectUrl = `${currentUrl}/#/?link=${encodeURIComponent(link)}`
		// const redirectUrl = `${link}&w=${currentWallet}`
		return <div className={classNames(styles.container, {
			[styles.sliderShow]: showSlider,
      [styles.sliderHide]: showSlider === false
		})}>
			<PageExpandable
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
					{this.defineButton({ wallet: currentWallet, coinbaseLink: null, redirectUrl })}
					{this.renderSlider({ wallet: currentWallet })}
				</div>
			</PageExpandable>
		</div>
	}

	defineButton ({ coinbaseLink, wallet, redirectUrl }) {
    if (this.platform === 'desktop') { return null }

    if (wallet !== 'fortmatic' && wallet !== 'portis') {
      const buttonTitle = getWalletData({ wallet: wallet }).name
      const buttonLink = getWalletLink({ coinbaseLink, platform: this.platform, wallet, currentUrl: redirectUrl })
      return <Button href={buttonLink} target='_blank' className={styles.button}>
        {this.t('buttons.useWallet', { title: buttonTitle })}
      </Button>
    }
    return null
    return this.renderConnectorButton({ context, loading, connector: capitalize({ string: wallet }) })
  }

	renderSlider ({ wallet }) {
    const { platform } = this
    return <Slider
      t={this.t}
      platform={platform}
      walletType={wallet}
      selectWallet={({ id }) => {
        this.toggleSlider({
          showSlider: false,
          callback: () => this.setState({ currentWallet: id })
        })
      }}
      showSlider={_ => {
        this.toggleSlider({
          showSlider: true
        })
      }}
    />
  }

  toggleSlider ({ showSlider = true, callback }) {
    this.setState({
      showSlider
    }, () => callback && callback())
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
}

export default MobileClaimOptions