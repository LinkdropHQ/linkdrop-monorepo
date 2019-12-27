import React from "react";

function ExpandArrowIcon(props) {
  return (
    <svg width={14} height={14} fill="none" {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M7.516.406a.642.642 0 00-.908 0 .634.634 0 000 .901l5.2 5.165H.643A.64.64 0 000 7.11a.64.64 0 00.642.637h11.166l-5.2 5.165a.634.634 0 000 .901c.251.25.657.25.908 0l6.288-6.245a.64.64 0 00.164-.659.634.634 0 00-.156-.25L7.516.406z"
        fill={props.fill || "#0025FF"}
      />
    </svg>
  );
}

export default ExpandArrowIcon