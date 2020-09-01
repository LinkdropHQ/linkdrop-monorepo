import React, { useState } from 'react'
import styles from './styles.module.scss'
import classNames from 'classnames'


const CloseButton = (props) => <svg width={12} height={12} fill="none" {...props}>
  <path
    d="M10.903 1.096a.331.331 0 00-.466 0L6 5.533 1.563 1.096a.33.33 0 00-.466.468L5.533 6l-4.436 4.436a.33.33 0 00.466.467L6 6.467l4.437 4.436a.33.33 0 10.466-.467L6.467 6l4.436-4.436a.33.33 0 000-.468z"
    fill="#0025FF"
    stroke="#0025FF"
    strokeWidth={0.5}
  />
</svg>  

const Note = ({ text, aside }) => {
  const [ visible, setVisible ] = useState(true)
  if (!visible) { return null }
  return <div className={classNames(styles.container, {
    [styles.containerAside]: aside
  })}>
    <div className={styles.close} onClick={_ => setVisible(false)}>
      <CloseButton />
    </div>
    <div dangerouslySetInnerHTML={{ __html: text }}/>
  </div>
}

export default Note