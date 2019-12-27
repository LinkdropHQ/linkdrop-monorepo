import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { Step5, Step6 } from 'components/pages/common'

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
    const { items, match = {} } = this.props
    const params = match.params || {}
    const { id } = params
    const currentItem = items.find(item => Number(item.id) === Number(id))
    const { links, linksAmount } = currentItem
    console.log({ currentItem })
    return <div className={styles.container}>
      {this.renderContent({ id, links, linksAmount })}
    </div>
  }

  renderContent ({ id, links, linksAmount }) {
    if (linksAmount > 0 && links.length === 0) { return <Step6 campaignToCheck={id} /> }
    return <Step5 campaignToCheck={id} />
  }
}

export default CampaignInfo
