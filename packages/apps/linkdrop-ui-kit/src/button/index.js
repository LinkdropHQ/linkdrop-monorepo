import React from 'react'
import classNames from 'classnames'
import styles from './styles.module'
import PropTypes from 'prop-types'

class Button extends React.Component {
  render () {
    const { disabled, target, children, inverted, onClick, className, loadingClassName, size = 'normal', loading, href } = this.props
    if (href) {
      return <a
        href={href}
        target={target}
        disabled={disabled}
        className={this.defineClassNames({ disabled, size, loading, className, inverted })}
      >
        {children}
      </a>
    }
    return <button
      onClick={_ => !disabled && onClick && onClick()}
      disabled={disabled}
      className={this.defineClassNames({ disabled, size, loading, className, inverted })}
    >
      {loading ? <div className={classNames(styles.loading, loadingClassName)}><div /><div /><div /><div /></div> : children}
    </button>
  }

  defineClassNames ({ disabled, size, loading, className, inverted }) {
    return classNames(styles.container, className, styles[`${size}Size`], {
      [styles.disabled]: disabled,
      [styles.inverted]: inverted
    })
  }
}

Button.propTypes = {
  disabled: PropTypes.bool,
  inverted: PropTypes.bool,
  children: PropTypes.any,
  onClick: PropTypes.func,
  loading: PropTypes.bool
}

export default Button
