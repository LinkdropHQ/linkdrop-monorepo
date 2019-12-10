export default () => {
  return (component) => {
    const { prototype } = component
    const isOpera = (!!window.opr && !!opr.addons) || !!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0 || navigator.userAgent.indexOf(' OPT/') >= 0
    const isFirefox = typeof InstallTrigger !== 'undefined'
    const isSafari = /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === '[object SafariRemoteNotification]' })(!window.safari || (typeof safari !== 'undefined' && safari.pushNotification))
    const isIE = /* @cc_on!@ */false || !!document.documentMode
    const isEdge = !isIE && !!window.StyleMedia
    const isChrome = !!window.chrome && (!!window.chrome.webstore || !!window.chrome.runtime)
    const isBlink = (isChrome || isOpera) && !!window.CSS
    if (isFirefox) { prototype.isFirefox = true }
    if (isOpera) { prototype.isOpera = true }
    if (isSafari) { prototype.isSafari = true }
    if (isIE) { prototype.isIE = true }
    if (isEdge) { prototype.isEdge = true }
    if (isChrome) { prototype.isChrome = true }
    if (isBlink) { prototype.isBlink = true }
  }
}
