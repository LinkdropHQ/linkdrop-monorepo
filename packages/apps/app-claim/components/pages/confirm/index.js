import React from 'react'
import { translate, actions } from 'decorators'
import styles from './styles.module'
import { Page } from 'components/pages'
import { TokensAmount, AssetBalance, AccountBalance } from 'components/common'
import dapps from 'dapps'
import classNames from 'classnames'
import { getHashVariables } from '@linkdrop/commons'
import { Button } from '@linkdrop/ui-kit'

@actions(({ assets: { items, itemsToClaim } }) => ({ items }))
@translate('pages.confirm')
class Confirm extends React.Component {
  render () {
    return <Page dynamicHeader>
      <div className={classNames(styles.container)}>
        <div className={styles.title} dangerouslySetInnerHTML={{ __html: this.t('titles.main') }} />
        <div className={styles.buttonsContainer}>
          <Button inverted className={styles.button}>{this.t('buttons.cancel')}</Button>
          <Button className={styles.button}>{this.t('buttons.confirm')}</Button>
        </div>

        <div className={styles.extraInfo} dangerouslySetInnerHTML={{ __html: this.t('descriptions.extraInfo') }} />
      </div>
    </Page>
  }
}

export default Confirm
