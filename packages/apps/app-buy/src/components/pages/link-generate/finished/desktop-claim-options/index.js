import React, { useState } from 'react'
import styles from './styles.module'
import { Button } from 'components/common'
import { PageExpandable } from 'components/pages'
import connectors from 'components/application/connectors'
import {
  Web3ReactProvider,
  useWeb3React
} from "@web3-react/core";
import Web3 from 'web3'

import DesktopClaimPage from '../desktop-claim'
import { getImages } from 'helpers'
import { RetinaImage, Loading } from '@linkdrop/ui-kit'

function getLibrary(provider) {
  return new Web3(provider);
}

export default ({ expanded, onChange, translate }) => {
	return <Web3ReactProvider getLibrary={getLibrary}>
		<PageExpandable
		  expanded={expanded}
		  fullContent
		  onClose={_ => onChange && onChange(!expanded)}
		>
			<Content translate={translate} />
		</PageExpandable>
	</Web3ReactProvider>
}

const Content = ({ translate }) => {
	const context = useWeb3React();
  const {
    connector,
    library,
    chainId,
    account,
    activate,
    deactivate,
    active,
    error
  } = context;


  if (error) {
  	console.log(error)
    return <div>Error Occured!</div>
  }

  if (library) {
  	return <DesktopClaimPage web3Provider={library}/>
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
	      	context.activate(connectors['Fortmatic'])
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
	      	context.activate(connectors['Portis'])
	      }}
	      inverted
	    >
	      <RetinaImage width={20} {...getImages({ src: 'portis-icon' })} />
	      <span>{translate('buttons.portis')}</span>
	    </Button>

	    <Button
	      className={styles.button}
	      iconed
	      onClick={_ => context.activate(connectors['MetaMask'])}
	      inverted
	    >
	    	<RetinaImage width={20} {...getImages({ src: 'metamask-icon' })} />
	      <span>{translate('buttons.metamask')}</span>
	    </Button>
	  </div>
	</div>
}