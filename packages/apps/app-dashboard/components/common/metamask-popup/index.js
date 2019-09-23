import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { RetinaImage, Icons } from '@linkdrop/ui-kit'
import { getImages } from 'helpers'

@actions(({ user: { chainId } }) => ({ chainId }))
@translate('common.pageHeader')
class MetamaskPopup extends React.Component {
  render () {
    const { amount } = this.props
    const popup = this.definePopup({ amount })
    return <div className={styles.container}>
      {popup}
    </div>
  }

  definePopup ({ amount }) {
    if (amount != null) {
      return <div className={styles.content}>
        <div className={styles.amount}>
          <Icons.Ethereum />{Number(amount)}
        </div>
        <RetinaImage
          className={styles.img}
          width={245}
          {...getImages({ src: 'popup' })}
        />
        <div className={styles.arrow}>
          <Icons.Cursor />
        </div>
      </div>
    }

    return <div className={styles.content}>
      <RetinaImage
        className={styles.img}
        width={245}
        {...getImages({ src: 'popup-approve' })}
      />
      <div className={styles.arrow}>
        <Icons.Cursor />
      </div>
    </div>
  }
}

export default MetamaskPopup
