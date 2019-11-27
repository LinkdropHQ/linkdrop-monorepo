import isIos from 'is-ios'
import isAndroid from 'is-android'

export default () => {
  if (isIos) {
    return 'ios'
  } else if (isAndroid) {
    return 'android'
  } else {
    return 'desktop'
  }
}
