import React from 'react'
import styles from './styles.module'
import variables from 'variables'
import classNames from 'classnames'

class ComponentInternalLoading extends React.Component {
  render () {
    const { color = variables.whiteColor, className } = this.props
    const borderColor = `${color} transparent transparent transparent`
    return <div className={classNames(styles.loading, className)}><div style={{ borderColor }} /><div style={{ borderColor }} /><div style={{ borderColor }} /><div style={{ borderColor }} /></div>
  }
}

export default ComponentInternalLoading
