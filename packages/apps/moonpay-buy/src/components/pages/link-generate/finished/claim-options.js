import React from 'react'
import styles from './styles.module'
import { Button } from 'components/common'
import { PageExpandable } from 'components/pages'
import connectors from 'components/application/connectors'
import Web3Provider, { useWeb3Context, Web3Consumer } from "web3-react";
import ClaimPage from './claim-page'

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
  console.log(context);

  if (context.error) {
    return <div>Error Occured!</div>
  }

  if (context.library) {
  	return <ClaimPage web3Provider={context.library._web3Provider}/>
  }

  return <ConnectorsSelect context={context} translate={translate} />
}


const ConnectorsSelect = ({ context, translate }) => {
	return <div>
		<div
			className={styles.title}
			dangerouslySetInnerHTML={{ __html: translate('titles.needAWallet') }}
		/>
	  <div>
	    <Button
	      className={styles.button}
	      onClick={_ => context.setConnector('Fortmatic')}
	      inverted
	    >
	      {translate('buttons.fortmatic')}
	    </Button>

	    <Button
	      className={styles.button}
	      onClick={_ => context.setConnector('Portis')}
	      inverted
	    >
	      {translate('buttons.portis')}
	    </Button>

	    <Button
	      className={styles.button}
	      onClick={_ => context.setConnector('MetaMask')}
	      inverted
	    >
	      {translate('buttons.metamask')}
	    </Button>
	  </div>
	</div>
}