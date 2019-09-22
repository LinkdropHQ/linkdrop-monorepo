import React from 'react'
import { actions, translate } from 'decorators'
import { Icons, Button } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { Page } from 'components/pages'
import classNames from 'classnames'
import QRCode from 'qrcode.react'
import { copyToClipboard, defineEtherscanUrl } from '@linkdrop/commons'
import { prepareRedirectUrl } from 'helpers'

@actions(({ user: { loading, contractAddress, chainId }, assets: { items } }) => ({ contractAddress, items, loading, chainId }))
@translate('pages.receive')
class Receive extends React.Component {
  render () {
    const { contractAddress, chainId } = this.props
    return <Page hideHeader>
      <div className={classNames(styles.container)}>
        <div className={styles.close} onClick={_ => { window.location.href = prepareRedirectUrl({ link: '/#/' }) }}>
          <Icons.Cross />
        </div>
        <div className={styles.content}>
          <div className={styles.qr}>
            <div className={styles.qrItem}><QRCode size={132} value={contractAddress} /></div>
          </div>

          <div className={styles.address}>
            <div className={styles.addressText}>
              {contractAddress}
              <a target='_blank' href={`${defineEtherscanUrl({ chainId })}address/${contractAddress}`}>
                <span className={styles.addressCheck}>i</span>
              </a>
            </div>
          </div>

          <div className={styles.controls}>
            <Button
              onClick={_ => copyToClipboard({ value: contractAddress })} className={styles.button}
            >Copy
            </Button>
          </div>
        </div>
      </div>
    </Page>
  }
}

export default Receive
