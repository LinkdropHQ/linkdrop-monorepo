export default ({ url }) => {
  if (url === null || url==='') {
    return false
  } else {
    url = url.toString()
  }
  return url.replace(/[^\x20-\x7E]/g, '')
}