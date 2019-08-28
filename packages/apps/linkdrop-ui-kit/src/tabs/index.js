import React from 'react'
import classNames from 'classnames'
import styles from './styles.module'
import PropTypes from 'prop-types'

class Tabs extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      active: props.active
    }
  }

  componentWillReceiveProps ({ active }) {
    const { active: currentActive } = this.state
    if (active == null) { return }
    if (active !== currentActive) {
      this.setState({
        active
      })
    }
  }

  render () {
    const { options = [], onChange, className } = this.props
    const { active } = this.state
    return <div className={classNames(styles.container, className)}>
      {options.map(({ title, id, disabled }) => <div
        key={id}
        className={classNames(styles.option, {
          [styles.active]: active === id,
          [styles.disabled]: disabled
        })}
        onClick={_ => !disabled && this.setState({ active: id }, _ => onChange && onChange({ id }))}
      >
        {title}
      </div>)}
    </div>
  }
}

Tabs.propTypes = {
  options: PropTypes.array,
  active: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
}

export default Tabs
