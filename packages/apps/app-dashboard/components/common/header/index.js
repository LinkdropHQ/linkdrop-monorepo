import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { withRouter } from 'react-router'
import text from 'texts'
import { Icons } from '@linkdrop/ui-kit'
import ProgressBar from './progress-bar'

@actions(({ user: { step } }) => ({ step }))
@translate('common.header')
class Header extends React.Component {
  render () {
    const { step } = this.props
    const currentPage = this.defineCurrentPage()
    return <header className={styles.container}>
      <div className={styles.main}>
        <div className={styles.title}>
          {currentPage}
        </div>
        {step === 5 && <div className={styles.icon}><Icons.Done /></div>}
        {step && step !== 5 && <ProgressBar stepsCount={3} currentStep={step} />}
      </div>
      <div className={styles.helpDesk}>
        <a target='_blank' href='https://www.notion.so/Help-Center-9cf549af5f614e1caee6a660a93c489b'>
          {this.t('help')}<Icons.ExternalLink />
        </a>
      </div>
    </header>
  }

  defineCurrentPage () {
    const { location: { pathname }, step } = this.props
    if (pathname === '/campaigns') { return text('common.paths.campaigns') }
    if (pathname === '/campaigns/create' || pathname === '/campaigns/create-erc-721') {
      if (step === 5) {
        return text('common.paths.campaignCreated')
      }
      return text('common.paths.campaignsCreate')
    }
    if (pathname.indexOf('/campaigns/') > -1) { return text('common.paths.campaignsId') }
    if (pathname === '/') { return text('common.paths.dashboard') }
    return text('common.paths.notFound')
  }
}

export default withRouter(Header)
