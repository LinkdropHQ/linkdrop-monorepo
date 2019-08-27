export default ({ contacts = [] }) => {
  return contacts.reduce((sum, { emailAddresses = [], names = [] }) => {
    return sum.concat({
      email: (emailAddresses[0] || {}).value,
      name: (names[0] || {}).displayName
    })
  }, [])
}
