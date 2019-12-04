import React, { useState } from 'react'
import styles from './styles.module'
import { Button } from 'components/common'
import { PageExpandable } from 'components/pages'
import connectors from 'components/application/connectors'
import Web3Provider, { useWeb3Context, Web3Consumer } from "web3-react";
import DesktopClaimPage from '../desktop-claim'
import { getImages } from 'helpers'
import { RetinaImage, Loading } from '@linkdrop/ui-kit'

export default ({ expanded, onChange, translate }) => {
	return <Web3Provider connectors={connectors} libraryName="ethers.js">
		<PageExpandable
		  expanded={expanded}
		  fullContent
		  onClose={_ => onChange && onChange(!expanded)}
		>
			<Content translate={translate} />
		</PageExpandable>
	</Web3Provider>
}

const Content = ({ translate }) => {
	const context = useWeb3Context();

  if (context.error) {
    return <div>Error Occured!</div>
  }

  if (context.library) {
  	return <DesktopClaimPage web3Provider={context.library._web3Provider}/>
  }

  return <ConnectorsSelect context={context} translate={translate} />
}


const ConnectorsSelect = ({ context, translate }) => {
	const [ loading, setLoading ] = useState(false)
	return <div>
		{loading && <Loading withOverlay />}
		<div
			className={styles.title}
			dangerouslySetInnerHTML={{ __html: translate('titles.needAWallet') }}
		/>
	  <div>
	    <Button
	      className={styles.button}
	      iconed
	      onClick={_ => {
	      	setLoading(true)
	      	context.setConnector('Fortmatic')
	      }}
	      inverted
	    >
	      <RetinaImage width={20} {...getImages({ src: 'fortmatic-icon' })} />
	      <span>{translate('buttons.fortmatic')}</span>
	    </Button>

	    <Button
	    	iconed
	      className={styles.button}
	      onClick={_ => {
	      	setLoading(true)
	      	context.setConnector('Portis')
	      }}
	      inverted
	    >
	      <RetinaImage width={20} {...getImages({ src: 'portis-icon' })} />
	      <span>{translate('buttons.portis')}</span>
	    </Button>

	    <Button
	      className={styles.button}
	      iconed
	      onClick={_ => context.setConnector('MetaMask')}
	      inverted
	    >
	    	<RetinaImage width={20} {...getImages({ src: 'metamask-icon' })} />
	      <span>{translate('buttons.metamask')}</span>
	    </Button>
	  </div>
	</div>
}