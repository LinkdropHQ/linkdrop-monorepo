import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import { MetamaskPopup } from 'components/common'
import { convertFromExponents } from '@linkdrop/commons'
import { multiply, bignumber, add } from 'mathjs'
import config from 'config-dashboard'

@actions(_ => ({}))
@translate('common.instruction')
class Instruction extends React.Component {
  render () {
    const { ethAmount, tokenAmount, tokenSymbol, linksAmount } = this.props
    return <div className={styles.container}>
      <p className={styles.text} dangerouslySetInnerHTML={{ __html: this.t('texts._3') }} />
      <MetamaskPopup amount={tokenAmount ? 0 : convertFromExponents(multiply(add(bignumber(ethAmount), config.linkPrice), bignumber(linksAmount)))} />
      <p className={styles.textExtra} dangerouslySetInnerHTML={{ __html: this.t('texts._2') }} />
    </div>
  }
}

export default Instruction
