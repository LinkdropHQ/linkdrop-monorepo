import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'

class NFTToken extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      selected: props.selected
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
    const { selected } = this.state
    return <div className={classNames(styles.container, {
      [styles.selected]: selected
    })}
    >
      <div className={styles.imageContainer}>
        <img src={image} />
      </div>
      <div className={styles.title}>
        {name}
      </div>
      <input type='checkbox' checked={selected} onChange={e => this.onSelect(e)} />
    </div>
  }

  onSelect (e) {
    const { onSelect } = this.props
    const value = e.target.checked
    this.setState({
      selected: value
    }, _ => onSelect && onSelect({ selected: value }))
  }
}

export default NFTToken
