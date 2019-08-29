import variables from 'variables'
import React from 'react'

const Qr = props => (
  <svg width={32} height={32} fill='none' {...props}>
    <path
      d='M10.375 17.875H4.75A3.75 3.75 0 001 21.625v5.625A3.75 3.75 0 004.75 31h5.625a3.75 3.75 0 003.75-3.75v-5.625a3.75 3.75 0 00-3.75-3.75zm0 8.438a.938.938 0 01-.938.937h-3.75a.938.938 0 01-.937-.938v-3.75a.937.937 0 01.938-.937h3.75a.938.938 0 01.937.938v3.75zM27.25 1h-5.625a3.75 3.75 0 00-3.75 3.75v5.625a3.75 3.75 0 003.75 3.75h5.625a3.75 3.75 0 003.75-3.75V4.75A3.75 3.75 0 0027.25 1zm0 8.438a.938.938 0 01-.938.937h-3.75a.938.938 0 01-.937-.938v-3.75a.938.938 0 01.938-.937h3.75a.937.937 0 01.937.938v3.75zM10.375 1H4.75A3.75 3.75 0 001 4.75v5.625a3.75 3.75 0 003.75 3.75h5.625a3.75 3.75 0 003.75-3.75V4.75A3.75 3.75 0 0010.375 1zm0 8.438a.938.938 0 01-.938.937h-3.75a.938.938 0 01-.937-.938v-3.75a.937.937 0 01.938-.937h3.75a.937.937 0 01.937.938v3.75z'
      fill={variables.blackColor}
      stroke='#fff'
      strokeWidth={0.5}
    />
    <circle cx={20.5} cy={20.5} r={2.5} fill={variables.blackColor} />
    <circle cx={28} cy={20.5} r={2.5} fill={variables.blackColor} />
    <circle cx={28} cy={28} r={2.5} fill={variables.blackColor} />
    <circle cx={20.5} cy={28} r={2.5} fill={variables.blackColor} />
  </svg>
)

export default Qr
