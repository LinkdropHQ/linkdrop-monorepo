export default function * ({ ens, provider }) {
  try {
    const address = yield provider.resolveName(ens)
    return address
  } catch (e) {
    window.alert('Some error occured')
  }
}
