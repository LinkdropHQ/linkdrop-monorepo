import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import classNames from 'classnames'
// import { Button, PageHeader } from 'components/common'
import { Loading } from 'linkdrop-ui-kit'
import { ethers } from 'ethers'

@actions(({ user: { loading }, campaigns: { items, current } }) => ({ items, current, loading }))
@translate('pages.campaignCreate')
class Step5 extends React.Component {
  render () {
    const { items, current, campaignToCheck, loading } = this.props
    const currentCampaign = items.find(item => item.id === (campaignToCheck || current))
    // const links = (currentCampaign || {}).links
    if (!currentCampaign) { return null }
    console.log({ currentCampaign })
    const herokuBaseUrl = 'https://heroku.com/deploy?template=https://github.com/dobrokhvalov/linkdrop-dc-server-v2'
    const signingKey = currentCampaign.privateKey
    const chain = currentCampaign.chainId === '4' ? 'rinkeby' : 'mainnet'
    const masterAddress = currentCampaign.currentAddress
    const campaignId = currentCampaign.campaignId
    const maxClaims = currentCampaign.linksAmount
    const weiAmount = ethers.utils.parseEther(currentCampaign.ethAmount || '0').toString()
    const tokenAmount = ethers.utils.parseEther(currentCampaign.tokenAmount || '0').toString()
    
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
git clone https://github.com/LinkdropProtocol/decentraland-claim-app

# install
cd decentraland-claim-app && yarn && yarn compile-contracts && cd apps/linkdrop-ui-kit && yarn build && cd ../app-claim
 
# Update the following command with correct env vars:
# - GOOGLE_CAPTCHA_SITE_KEY: Google reCaptcha Site Key
# - SEGMENT_KEY: Segment API key
# - HEROKU_HOST: Heroku host that was deployed on the step 1, e.g. https://dc-linkdrop-rinkeby-01.herokuapp.com
# - AUTH0_DOMAIN: Auth0 domain, e.g. https://dcl-test.auth0.com
# - AUTH0_CLIENT_ID: Auth0 Client Id, e.g. iRGF5TR5DBngi8yifjDGuHzixa9Q9HA8
# - AUTH0_CALLBACK_URL: Auth0 callback url, should the url where the front-end will be served, e.g. https://claim.decentraland.org
# - SUCCESS_REDIRECT_URL: Redirect url after successful claim. (https://decentraland.org by default)
GOOGLE_CAPTCHA_SITE_KEY=<GOOGLE_CAPTCHA_SITE_KEY> SEGMENT_KEY=<SEGMENT_KEY> HEROKU_HOST=<HEROKU_HOST> AUTH0_DOMAIN=<AUTH0_DOMAIN> AUTH0_CLIENT_ID=<AUTH0_CLIENT_ID> AUTH0_CALLBACK_URL=<CLAIM_APP_HOST> CHAIN_ID=${currentCampaign.chainId} AMOUNT=100 SYMBOL=MANA SUCCESS_REDIRECT_URL=https://decentraland.org PROXY_ADDRESS=${currentCampaign.id} yarn build

# Front-end app assets will be compiled to linkdrop-monorepo/apps/app-claim                                                                
`}
     </textarea>
          </div>}
    </div>

    

      </div>

    </div>
  }
}

export default Step5
