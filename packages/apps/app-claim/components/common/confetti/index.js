import React from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'
import Confetti from 'react-confetti'
import styles from './styles.module'

const ConfettiComponent = ({ recycle }) => {
  const { width, height } = useWindowSize()
  return <div className={styles.container}>
    <Confetti
      width={width}
      recycle={recycle}
      height={height}
    />
  </div>
}

export default ConfettiComponent
