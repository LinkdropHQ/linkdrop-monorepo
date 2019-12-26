import React from "react";

function ContinueArrowIcon(props) {
  return (
    <svg width={10} height={14} fill="none" {...props}>
      <path
        d="M9 7l.6.8a1 1 0 000-1.6L9 7zM.4 12.2a1 1 0 001.2 1.6L.4 12.2zM1.6.2A1 1 0 10.4 1.8L1.6.2zm6.8 6l-8 6 1.2 1.6 8-6-1.2-1.6zm-8-4.4l8 6 1.2-1.6-8-6L.4 1.8z"
        fill={props.fill || "#FFF"}
      />
    </svg>
  );
}

export default ContinueArrowIcon