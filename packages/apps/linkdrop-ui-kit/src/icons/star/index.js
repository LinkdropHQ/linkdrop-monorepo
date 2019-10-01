import React from 'react'
import variables from 'variables'

const Star = props => (
  <svg width={60} height={57} fill='none' {...props}>
    <path
      d='M27.147 4.781c.898-2.764 4.808-2.764 5.706 0l4.331 13.33a3 3 0 0 0 2.854 2.073h14.016c2.906 0 4.114 3.72 1.763 5.427l-11.34 8.239a3 3 0 0 0-1.089 3.354l4.331 13.33c.898 2.764-2.265 5.063-4.616 3.355l-11.34-8.239a3 3 0 0 0-3.526 0l-11.34 8.239c-2.35 1.708-5.514-.59-4.616-3.355l4.331-13.33a3 3 0 0 0-1.09-3.354l-11.34-8.239c-2.35-1.708-1.142-5.427 1.764-5.427h14.016a3 3 0 0 0 2.854-2.073l4.33-13.33z'
      fill={props.fill || variables.blackColor}
      strokeWidth={props.strokeWidth || 4}
      stroke={props.stroke || 'transparent'}
    />
  </svg>
)

export default Star
