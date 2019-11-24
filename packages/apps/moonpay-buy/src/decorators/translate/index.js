import text from 'texts'

export default (prefix) => {
  return (component) => {
    const { prototype } = component
    prototype.tPrefix = (prefix = '') => function (key, options) { return text(`${prefix || ''}${prefix === '' ? '' : '.'}${key}`, options) }
    prototype.t = prototype.tPrefix(prefix)
  }
}
