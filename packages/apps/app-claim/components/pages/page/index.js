import React from 'react'
import { Header, Footer } from '@linkdrop/ui-kit'
import { WalletHeader } from 'components/common'
import styles from './styles.module'
import { translate } from 'decorators'
import text from 'texts'
@translate('pages.page')
class Page extends React.Component {
  render () {
    const { dynamicHeader } = this.props
    return <div className={styles.container}>
      {dynamicHeader ? <WalletHeader /> : <Header title={this.t('titles.getTokens')} />}
      <div className={styles.main}>
        {this.props.children}
      </div>
      <Footer
        content={text('components.footer.copyright')}
        href='https://linkdrop.io'
      />
    </div>
  }
}

export default Page
