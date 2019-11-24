import React from 'react'

const Done = props => (
  <svg width={26} height={26} fill='none' {...props}>
    <circle cx={13} cy={13} r={13} fill={props.fill || '#0025FF'} />
    <path
      d='M11.661 18.342c-.345 0-.688-.133-.946-.398l-4.338-4.431a1.323 1.323 0 111.893-1.851l3.482 3.557 7.075-5.911a1.324 1.324 0 011.698 2.031l-8.015 6.696a1.322 1.322 0 01-.849.307z'
      fill='#fff'
    />
  </svg>
)

export default Done
