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
        src='https://s3.amazonaws.com/neon-district-founders-sale/07_RiotShield/008_RiotShield_UnCommon.png'
      />
      <p
        className={styles.description}
        dangerouslySetInnerHTML={{
          __html: this.t('texts.description', {
            href: 'https://google.com'
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
