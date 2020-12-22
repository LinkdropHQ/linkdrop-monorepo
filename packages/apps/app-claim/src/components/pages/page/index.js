import React from 'react'
import { Header, Footer } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate } from 'decorators'
import text from 'texts'
import cn from 'classnames'
import { getHashVariables } from '@linkdrop/commons'

@translate('pages.page')
class Page extends React.Component {
  render () {
    const { variant } = getHashVariables()
    return <div className={styles.container}>
      {!variant && <Header
        title={this.t('titles.getTokens')}
      />}
      <div
      className={cn(styles.main, {
        [styles.mainNoHeader]: variant
      })}>
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
