import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Step5 } from 'components/pages/common'

@actions(({ campaigns: { items } }) => ({ items }))
@translate('pages.campaignInfo')
class CampaignInfo extends React.Component {
  componentDidMount () {
    const campaignToCheck = ((this.props.match || {}).params || {}).id
    const { items } = this.props
    const itemFind = items.find(item => Number(item.id) === Number(campaignToCheck))

    if (!items || !itemFind) {
      window.location.href = '/#/campaigns'
    }
  }

  render () {
    const campaignToCheck = ((this.props.match || {}).params || {}).id
    return <div className={styles.container}>
      <Step5 campaignToCheck={campaignToCheck} />
    </div>
  }
}

export default CampaignInfo
