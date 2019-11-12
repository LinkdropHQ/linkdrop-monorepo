import React from 'react'
import variables from 'variables'

const ArrowClose = props => (
  <svg width={25} height={25} fill='none' {...props}>
    <path
      fillRule='evenodd'
      clipRule='evenodd'
      d='M11.338 23.77c.22.218.506.326.793.326.287 0 .575-.108.794-.326a1.109 1.109 0 000-1.576l-9.093-9.031h19.526c.62 0 1.122-.5 1.122-1.115s-.503-1.114-1.122-1.114H3.832l9.093-9.031a1.109 1.109 0 000-1.576 1.127 1.127 0 00-1.587 0L.342 11.247a1.126 1.126 0 00-.236.328 1.104 1.104 0 00-.046.833c.053.157.143.304.269.428L11.338 23.77z'
      fill={props.fill || variables.dbBlue}
    />
  </svg>
)

export default ArrowClose
