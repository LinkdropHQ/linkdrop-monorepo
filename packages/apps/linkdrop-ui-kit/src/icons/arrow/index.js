import React from 'react'
import variables from 'variables'

const Arrow = props => (
  <svg className={props.className} width={15} height={17} fill='none' {...props}>
    <path
      d='M6.188 17h1.75V4.219h.125L12.875 9l1.188-1.156-7-7-7 7L1.28 9l4.782-4.781h.125V17z'
      fill={variables.blackColor}
    />
  </svg>
)

export default Arrow
