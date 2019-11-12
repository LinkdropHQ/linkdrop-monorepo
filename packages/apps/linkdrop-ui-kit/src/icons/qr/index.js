import React from 'react'
import variables from 'variables'

const SvgQrIcon = props => (
  <svg width={30} height={30} fill='none' {...props}>
    <path
      d='M10.375 15.875H4.75A3.75 3.75 0 001 19.625v5.625A3.75 3.75 0 004.75 29h5.625a3.75 3.75 0 003.75-3.75v-5.625a3.75 3.75 0 00-3.75-3.75zm0 8.438a.938.938 0 01-.938.937h-3.75a.938.938 0 01-.937-.938v-3.75a.937.937 0 01.938-.937h3.75a.938.938 0 01.937.938v3.75zM25.25 1h-5.625a3.75 3.75 0 00-3.75 3.75v5.625a3.75 3.75 0 003.75 3.75h5.625a3.75 3.75 0 003.75-3.75V4.75A3.75 3.75 0 0025.25 1zm0 8.438a.938.938 0 01-.938.937h-3.75a.938.938 0 01-.937-.938v-3.75a.938.938 0 01.938-.937h3.75a.937.937 0 01.937.938v3.75zM10.375 1H4.75A3.75 3.75 0 001 4.75v5.625a3.75 3.75 0 003.75 3.75h5.625a3.75 3.75 0 003.75-3.75V4.75A3.75 3.75 0 0010.375 1zm0 8.438a.938.938 0 01-.938.937h-3.75a.938.938 0 01-.937-.938v-3.75a.937.937 0 01.938-.937h3.75a.937.937 0 01.937.938v3.75z'
      fill={props.fill || variables.dbBlue}
      stroke={variables.whiteColor}
      strokeWidth={1.5}
    />
    <circle
      cx={18.5}
      cy={18.5}
      r={2.25}
      fill={props.fill || variables.dbBlue}
      stroke={variables.whiteColor}
      strokeWidth={0.5}
    />
    <circle
      cx={26}
      cy={18.5}
      r={2.25}
      fill={props.fill || variables.dbBlue}
      stroke={variables.whiteColor}
      strokeWidth={0.5}
    />
    <circle
      cx={26}
      cy={26}
      r={2.25}
      fill={props.fill || variables.dbBlue}
      stroke={variables.whiteColor}
      strokeWidth={0.5}
    />
    <circle
      cx={18.5}
      cy={26}
      r={2.25}
      fill={props.fill || variables.dbBlue}
      stroke={variables.whiteColor}
      strokeWidth={0.5}
    />
  </svg>
)

export default SvgQrIcon
