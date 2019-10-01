import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'
import { Checkbox, Icons } from '@linkdrop/ui-kit'
import variables from 'variables'
import { translate } from 'decorators'

@translate('common.nftToken')
class NFTToken extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.selected,
      imageErrored: false
    }
  }

  UNSAFE_componentWillReceiveProps ({ selected }) {
    const { selected: prevSelected } = this.props
    if (prevSelected !== selected) {
      this.setState({
        selected
      })
    }
  }

  render () {
    const {
      tokenId,
      address,
      symbol,
      name,
      image
    } = this.props
    const { selected, imageErrored } = this.state
    return <div className={classNames(styles.container, {
      [styles.selected]: selected
    })}
    >
      <div className={styles.imageContainer}>
        {this.renderImage({ image, imageErrored })}
      </div>
      <div className={styles.title}>
        {name}
      </div>
      <Checkbox className={styles.checkbox} onChange={({ value }) => this.onSelect({ value })} checked={selected} />
    </div>
  }

  renderImage ({ image, imageErrored }) {
    if (imageErrored) {
      return <div className={styles.defaultImage}>
        <Icons.Star fill='transparent' stroke={variables.dbBlue} strokeWidth={1} />
        <div className={styles.subtitle}>{this.t('titles.cantDisplayImage')}</div>
      </div>
    }
    return <img src={image} onError={_ => this.setState({ imageErrored: true })} />
  }

  onSelect ({ value }) {
    const { onSelect } = this.props
    this.setState({
      selected: value
    }, _ => onSelect && onSelect({ selected: value }))
  }
}

export default NFTToken
