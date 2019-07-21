import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
import { Button, PageHeader } from 'components/common'
import { Loading } from 'linkdrop-ui-kit'
import { ethers } from 'ethers'

@actions(({ user: { loading }, campaigns: { items, current } }) => ({ items, current, loading }))
@translate('pages.campaignCreate')
class Step5 extends React.Component {
  render () {
    const { items, current, campaignToCheck, loading } = this.props
    const currentCampaign = items.find(item => item.id === (campaignToCheck || current))
    const links = (currentCampaign || {}).links
    if (!currentCampaign) { return null }

    const herokuBaseUrl = 'https://heroku.com/deploy?template=https://github.com/dobrokhvalov/linkdrop-dc-server-v2'
    const signingKey = currentCampaign.privateKey
    const chain = currentCampaign.chainId === '4' ? 'rinkeby' : 'mainnet'
    const masterAddress = currentCampaign.currentAddress
    const campaignId = currentCampaign.campaignId
    const maxClaims = currentCampaign.linksAmount
    const weiAmount = ethers.utils.parseEther(currentCampaign.ethAmount || '0').toString()
    const tokenAmount = currentCampaign.tokenAmount || '0'
    const tokenAddress = currentCampaign.tokenAddress || ''
        
    const herokuUrl = (`${herokuBaseUrl}` +
                       `&env[LINKDROP_SIGNING_KEY]=${signingKey}` +
                       `&env[CHAIN]=${chain}` +
                       `&env[LINKDROP_MASTER_ADDRESS]=${masterAddress}` +
                       `&env[LINKDROP_CAMPAIGN_ID]=${campaignId}` +
                       `&env[MAX_CLAIMS]=${maxClaims}` +
                       `&env[WEI_AMOUNT]=${weiAmount}` +
                       `&env[TOKEN_AMOUNT]=${tokenAmount}` +
                       `&env[TOKEN_ADDRESS]=${tokenAddress}`
                      )
    
    
    return <div className={styles.container}>
      {loading && <Loading withOverlay />}
      <div className={styles.content}>
        <div className={styles.automatic}>
          <p className={classNames(styles.text, styles.textMargin15)}>{this.t('titles.contractParams')}</p>
          <p className={classNames(styles.text, styles.textMargin10, styles.ellipsis)} dangerouslySetInnerHTML={{ __html: this.t('titles.masterAddress', { address: currentCampaign.currentAddress }) }} />
      <p className={classNames(styles.text, styles.textMargin10, styles.ellipsis)} dangerouslySetInnerHTML={{ __html: this.t('titles.signingKey', { signingKey: currentCampaign.privateKey }) }} />
      <p className={classNames(styles.text, styles.textMargin10, styles.ellipsis)}>Proxy Address: <span>{currentCampaign.id}</span></p>
      <p className={classNames(styles.text, styles.ellipsis)} dangerouslySetInnerHTML={{ __html: this.t('titles.campaignId', { campaignId: currentCampaign.campaignId }) }} />
      <hr/>
      <p className={classNames(styles.text, styles.textMargin20)}>Step 1. Deploy Claim Server</p> 
      <p className={classNames(styles.text, styles.textMargin20)}>
      <a href={herokuUrl} target="_blank">
      <img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy" />
      </a>
      </p>
<hr/>
    {<div>
      <p className={classNames(styles.text, styles.textMargin20)}>Step 2. Deploy Front-End app</p> 
     <p className={classNames(styles.text, styles.textMargin20)}>Use the following command to build front-end assets:</p>
     <textarea disabled className={styles.codeBlock}>
{`# clone repo
git clone https://github.com/spacehaz/linkdrop-monorepo.git

# install
cd linkdrop-monorepo
CHAIN_ID=1 AMOUNT=100 SYMBOL=MANA DECENTRALAND_URL=https://decentraland.org CLAIM_HOST=<HEROKU_APP_HOST> DOMAIN=<AUTH0_DOMAIN> CLIENT_ID=<AUTH0_CLIENT_ID> CALLBACK_URL=<CLAIM_APP_HOST> PROXY_ADDRESS=${currentCampaign.id} CAPTCHA_KEY=<GOOGLE_SITE_KEY> SEGMENT_KEY=<SEGMENT_KEY> yarn && yarn compile-contracts && cd apps/linkdrop-ui-kit && yarn build && cd ../app-claim && yarn build
`}
     </textarea>
          </div>}
    </div>

    

      </div>

    </div>
  }
}

export default Step5
