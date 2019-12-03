import React from "react";

const CrossIcon = props => (
  <svg width={16} height={16} fill="none" {...props}>
    <path
      d="M8 9.416l6.29 6.292a1.002 1.002 0 101.416-1.416L9.417 8l6.29-6.292A1.002 1.002 0 0014.292.293L8 6.584 1.708.294A1.001 1.001 0 10.293 1.708l6.29 6.292-6.29 6.29a.998.998 0 000 1.416c.39.39 1.025.391 1.416 0L8 9.417z"
      fill={props.fill || "#979797"}
    />
  </svg>
);

export default CrossIcon