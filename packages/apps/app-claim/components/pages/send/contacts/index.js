/* global gapi */
import React from 'react'
import { actions, translate } from 'decorators'
import styles from './styles.module'
import Header from './header'
import { formatContacts } from '@linkdrop/commons'
import Item from './item'
import config from 'app.config.js'

@actions(({ contacts: { items: contactsItems }, user: { loading, contractAddress }, assets: { items } }) => ({ items, loading, contactsItems, contractAddress }))
@translate('pages.send')
class Contacts extends React.Component {
  componentDidMount () {
    window.alert("Contacts page loaded")
    const script = document.createElement('script')
    script.setAttribute('src', 'https://apis.google.com/js/api.js')
    script.setAttribute('async', true)
    script.onload = _ => this.handleClientLoad()
    script.onreadystatechange = function () {
      if (this.readyState === 'complete') this.onload()
    }
    document.body.appendChild(script)
  }

  handleClientLoad () {
    gapi.load('client:auth2', _ => this.initClient())
  }

  initClient () {
    // return gapi.auth2.getAuthInstance().signOut()
    gapi.client.init({
      clientId: config.authClientId,
      apiKey: config.authApiKey,
      discoveryDocs: config.authDiscoveryDocs,
      scope: `${config.authScopeDrive} ${config.authScopeContacts}`
    }).then(_ => {
      // Listen for sign-in state changes.
      if (gapi) {
        gapi.client.people.people.connections.list({
          resourceName: 'people/me',
          pageSize: 10,
          personFields: 'names,emailAddresses'
        }).then(response => {
          const contacts = response.result.connections
          if (contacts) {
            const contactsFormatted = formatContacts({ contacts })
            this.actions().contacts.setItems({ items: contactsFormatted })
          }
        })
      }
    }, error => {
      console.error(error)
    })
  }

  render () {
    const { contactsItems } = this.props
    return <div className={styles.container}>
      <Header title={this.t('titles.contacts')} />
      <div className={styles.content}>
        {contactsItems.map(({ name, email }) => <Item key={email} name={name} email={email} />)}
      </div>
    </div>
  }
}

export default Contacts
