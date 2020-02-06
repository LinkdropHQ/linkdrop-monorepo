import React from 'react'
import { Header } from '@linkdrop/ui-kit'
import { Footer } from 'components/pages/common'
import styles from './styles.module'
import { translate, platform } from 'decorators'
import text from 'texts'
import classNames from 'classnames'

@platform()
@translate('pages.page')
class Page extends React.Component {
  render () {
    return <div className={classNames(styles.container, {
    	[styles.ios]: this.platform === 'ios'
    })}>
      <div className={styles.main}>
        {this.props.children}
      </div>
      <Footer className={styles.footer} />
    </div>
  }
}

export default Page
