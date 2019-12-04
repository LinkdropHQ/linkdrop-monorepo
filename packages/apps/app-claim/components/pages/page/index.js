import React from 'react'
import { Header, Footer } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate } from 'decorators'
import text from 'texts'
import classNames from 'classnames'
import { getHashVariables } from '@linkdrop/commons'

@translate('pages.page')
class Page extends React.Component {
  render () {
    const { hideLayout } = getHashVariables()
    return <div className={styles.container}>
      {!hideLayout && <Header title={this.t('titles.getTokens')} />}
      <div
        className={classNames(styles.main, {
          [styles.hideLayout]: hideLayout
        })}
      >
        {this.props.children}
      </div>
      {!hideLayout && <Footer
        content={text('components.footer.copyright')}
        href='https://linkdrop.io'
      />}
    </div>
  }
}

export default Page
