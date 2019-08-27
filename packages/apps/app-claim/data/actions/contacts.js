class Contacts {
  constructor (actions) {
    this.actions = actions
  }

  setItems ({ items }) {
    this.actions.dispatch({ type: 'CONTACTS.SET_ITEMS', payload: { items } })
  }
}

export default Contacts
