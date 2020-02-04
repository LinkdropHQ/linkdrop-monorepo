import React from 'react'
import { Button } from '@linkdrop/ui-kit'
import classNames from 'classnames'
import styles from './styles.module'

export default props => <Button
	{...props}
	className={classNames(props.className, styles.container)}
/>