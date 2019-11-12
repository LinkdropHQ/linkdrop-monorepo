import isIos from 'is-ios'
import isAndroid from 'is-android'

export default () => {
  return (component) => {
    const { prototype } = component
    if (isIos) {
      prototype.platform = 'ios'
    } else if (isAndroid) {
      prototype.platform = 'android'
    } else {
      prototype.platform = 'desktop'
    }
  }
}
