import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import Step1 from './step-1'
// import Step2 from './step-2'
// import Step3 from './step-3'
// import Step4 from './step-4'
// import Step5 from './step-5'

@actions(({ campaigns: { items, proxyAddress }, user: { step, privateKey, currentAddress } }) => ({ items, proxyAddress, currentAddress, step, privateKey }))
@translate('pages.campaignCreate')
class CampaignCreate extends React.Component {
  componentDidMount () {
    this.actions().user.setStep({ step: 1 })
  }

  componentWillUnmount () {
    this.actions().user.setStep({ step: null })
  }

  render () {
    const { step } = this.props
    return <div className={styles.container}>
      {this.renderPage({ step })}
    </div>
  }

  renderPage ({ step }) {
    switch (Number(step)) {
      case 1:
        return <Step1 />
      // case 2:
      //   return <Step2 />
      // case 3:
      //   return <Step3 />
      // case 4:
      //   return <Step4 />
      // case 5:
      //   return <Step5 />
      default:
        return <Step1 />
    }
  }
}

export default CampaignCreate
