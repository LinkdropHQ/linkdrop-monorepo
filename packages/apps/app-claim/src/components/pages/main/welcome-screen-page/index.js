import React from 'react'
import { translate } from 'decorators'
import classNames from 'classnames'
import styles from './styles.module'
import commonStyles from '../styles.module'
import { RoundedButton } from 'components/common'

@translate('pages.welcomeScreen')
class WelcomeScreenPage extends React.Component {
  render () {
    const { icon, onClick } = this.props
    return <div className={commonStyles.container}>
      <h2 className={styles.title}>
        {this.t('titles.thankYou')}
      </h2>
      <img
        className={styles.image}
        src="https://i.ibb.co/sCX6Hn1/image-1.png"
      />
      <p
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: this.t('texts.description', {
            href: 'https://artblocks.io/project/5'
          })
        }}
      />
      <RoundedButton
        onClick={onClick}
      >
        {this.t('buttons.claim')}
      </RoundedButton>
    </div>
  }
}

export default WelcomeScreenPage
