import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'
import Icons from '../icons'
import PropTypes from 'prop-types'

class Checkbox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      checked: props.checked
    }
  }

  componentWillReceiveProps ({ checked }) {
    const { checked: prevChecked } = this.state
    if (checked != null && checked !== prevChecked) {
      this.setState({
        checked
      })
    }
  }

  render () {
    const { title, onChange, disabled, className } = this.props
    const { checked } = this.state
    return <div
      className={classNames(styles.container, className, {
        [styles.disabled]: disabled
      })}
      onClick={_ => !disabled && this.setState({ checked: !checked }, _ => onChange && onChange({ value: !checked }))}
    >
      <div className={styles.checkIcon}>
        {checked && <Icons.CheckSmall />}
      </div>
      {title && <div className={styles.title}>{title}</div>}
    </div>
  }
}

Checkbox.propTypes = {
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  title: PropTypes.string
}

export default Checkbox
