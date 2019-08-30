import React from 'react'
import { translate } from 'decorators'
import styles from './styles.module'
import { Tabs } from '@linkdrop/ui-kit'
import { prepareRedirectUrl } from 'helpers'

@translate('pages.common.controlTabs')
class ControlTabs extends React.Component {
  render () {
    const options = [
      { title: this.t('titles.request'), id: 'request' },
      { title: this.t('titles.pay'), id: 'pay' }
    ]
    return <div className={styles.container}>
      <Tabs
        options={options}
        className={styles.tabs}
        onChange={({ id }) => {
          if (id === 'pay') {
            window.location.href = prepareRedirectUrl({ link: '/#/send' })
          } else if (id === 'request') {
            window.location.href = prepareRedirectUrl({ link: '/#/get' })
          }
        }}
      />
    </div>
  }
}

export default ControlTabs
