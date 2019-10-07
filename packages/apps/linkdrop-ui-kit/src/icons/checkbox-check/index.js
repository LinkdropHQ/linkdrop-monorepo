import React from 'react'

const CheckboxCheck = props => (
  <svg width={14} height={10} fill='none' {...props}>
    <path
      d='M5.284 9.017a1.23 1.23 0 01-.883-.372L.352 4.503a1.238 1.238 0 01.02-1.75 1.233 1.233 0 011.746.02l3.25 3.325L11.972.573a1.235 1.235 0 011.74.156 1.239 1.239 0 01-.155 1.743L6.076 8.73c-.23.192-.512.287-.792.287z'
      fill={props.fill || '#0025FF'}
    />
  </svg>
)

export default CheckboxCheck
