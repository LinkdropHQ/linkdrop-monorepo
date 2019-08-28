import React from 'react'

const SvgDownIcon = props => (
  <svg width={14} height={10} fill='none' {...props}>
    <path
      d='M7 9l-.4.3a.5.5 0 00.8 0L7 9zM1.4.7a.5.5 0 00-.8.6l.8-.6zm12 .6a.5.5 0 10-.8-.6l.8.6zm-6 7.4l-6-8-.8.6 6 8 .8-.6zm5.2-8l-6 8 .8.6 6-8-.8-.6z'
      fill={props.fill || '#0025FF'}
    />
  </svg>
)

export default SvgDownIcon
