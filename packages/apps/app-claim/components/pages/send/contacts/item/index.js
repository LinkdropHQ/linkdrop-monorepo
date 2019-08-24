import React from 'react'
import styles from './styles.module'

const ContactsItem = ({ name, email, avatar }) => {
  const style = avatar ? { backgroundImage: `url(${avatar})` } : { backgroundColor: '#3F6AFF' }
  return <div className={styles.container}>
    <div className={styles.avatar} style={style} />
    <div className={styles.content}>
      <div className={styles.name}>{name}</div>
      <div className={styles.email}>{email}</div>
    </div>
  </div>
}

export default ContactsItem
