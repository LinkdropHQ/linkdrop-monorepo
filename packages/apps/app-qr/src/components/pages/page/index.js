import React from 'react'
import { Header, Footer } from '@linkdrop/ui-kit'
import styles from './styles.module'
import { translate } from 'decorators'
import text from 'texts'
@translate('pages.page')
class Page extends React.Component {
  render () {
    return <div className={styles.container}>
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
