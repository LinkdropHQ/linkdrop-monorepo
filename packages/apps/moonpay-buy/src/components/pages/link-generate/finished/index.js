import React from 'react'
import styles from './styles.module'
import { translate, actions } from 'decorators'
import { Button } from 'components/common'
import { PageExpandable } from 'components/pages'
import QRCode from 'qrcode.react'
import { Icons } from '@linkdrop/ui-kit'
import variables from 'variables'

@actions(({ assets: { ethBalanceFormatted }, link: { link } }) => ({
  link,
  ethBalanceFormatted
}))
@translate('pages.linkGenerate')
class Finished extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      expanded: false
    }
  }

  render () {
    const { expanded } = this.state
    const { link, ethBalanceFormatted } = this.props
    return <div className={styles.container}>
      {this.renderQR({ expanded, link })}
      <div className={styles.title}>
        <Icons.Done fill={variables.doneGreenColor} />{this.t('titles.linkIsDone')}
      </div>
      <div
        className={styles.subtitle}
        dangerouslySetInnerHTML={{
          __html: this.t('titles.instruction', {
            amount: ethBalanceFormatted || 0,
            symbol: 'ETH'
          })
        }}
      />
      <Button
        className={styles.button}
        target='_blank'
        href={link}
      >
        {this.t('buttons.claimInWallet')}
      </Button>
      <Button
        inverted
        className={styles.iconedButton}
        onClick={_ => {
          this.setState({ expanded: true })
        }}
      >
        <Icons.Qr />
        {this.t('buttons.showQR')}
      </Button>
    </div>
  }

  renderQR ({ expanded, link }) {
    return <PageExpandable
      expanded={expanded}
      onClose={_ => this.setState({
        expanded: false
      })}
    >
      {link && <div className={styles.qr}>
        <QRCode size={132} value={link} />
      </div>}
      <div
        className={styles.qrSubtitle}
        dangerouslySetInnerHTML={{ __html: this.t('titles.scanQR') }}
      />
    </PageExpandable>
  }
}

export default Finished
