import React from 'react'
import variables from 'variables'

const SvgCloseButton = props => (
  <svg width={24} height={23} viewBox='0 0 24 23' fill='none' {...props}>
    <path
      transform='scale(1.00499 .99499) rotate(45 -.845 1.757)'
      stroke={props.fill || variables.blackColor}
      d='M0-.5h30'
    />
    <path
      transform='matrix(.71063 -.70356 .71063 .70356 1 22.107)'
      stroke={props.fill || variables.blackColor}
      d='M0-.5h30'
    />
  </svg>
)

export default SvgCloseButton
