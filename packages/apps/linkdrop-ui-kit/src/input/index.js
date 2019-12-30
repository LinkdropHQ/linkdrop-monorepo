import React from 'react'
import styles from './styles.module'
import classNames from 'classnames'
import InputMask from 'react-input-mask'
import PropTypes from 'prop-types'
import Icons from '../icons'
import NumberFormat from 'react-number-format'
import { convertFromExponents } from '@linkdrop/commons'

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: props.value
    }
  }

  componentWillReceiveProps ({ value }) {
    const { value: prevValue } = this.state
    const { numberInput } = this.props
    if (value == null || value === prevValue || (numberInput && Number(value) === Number(prevValue))) { return }
    this.setState({
      value: numberInput ? convertFromExponents(value) : value
    })
  }

  render () {
    const { mask, className, disabled, type = 'text', placeholder, centered, numberInput, extraInfo } = this.props
    const { value } = this.state
    if (numberInput) return this.renderNumberInput()
    if (mask) return this.renderMaskInput()
    return <div className={styles.wrapper}>
      {extraInfo && <div className={styles.extraInfo}>
        <Icons.InformationIcon />
      </div>}
      <input type={type} placeholder={placeholder} disabled={disabled} value={value} className={this.defineClassNames({ className, disabled, centered })} onChange={e => this.changeValue(e)} />
    </div>
  }

  changeValue (e) {
    const { onChange } = this.props
    const value = e.target.value
    this.setState({
      value
    }, _ => onChange && onChange({ value }))
  }

  defineClassNames ({ className, disabled, centered }) {
    return classNames(styles.container, className, { [styles.disabled]: disabled, [styles.centered]: centered })
  }

  renderMaskInput () {
    const { value } = this.state
    const { onChange, className, disabled } = this.props
    return <div className={styles.wrapper}>
      <InputMask {...this.props} value={value} className={this.defineClassNames({ className, disabled })} onChange={e => onChange && onChange({ value: e.target.value })}>
        {(inputProps) => <input {...inputProps} />}
      </InputMask>
    </div>
  }

  renderNumberInput () {
    const { value } = this.state
    const { className, suffix, disabled, centered, format, decimalSeparator } = this.props
    return <div className={styles.wrapper}>
      <NumberFormat decimalSeparator={decimalSeparator} decimalScale={8} format={format} disabled={disabled} renderText={value => !disabled && <div>{value}</div>} value={value || 0} suffix={` ${suffix || ''}`} className={this.defineClassNames({ className, disabled, centered })} onChange={e => this.changeValue(e)} />
    </div>
  }
}

Input.propTypes = {
  mask: PropTypes.string,
  className: PropTypes.string,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  placeholder: PropTypes.string,
  alwaysShowMask: PropTypes.bool,
  maskChar: PropTypes.string,
  formatChars: PropTypes.object
}

export default Input
