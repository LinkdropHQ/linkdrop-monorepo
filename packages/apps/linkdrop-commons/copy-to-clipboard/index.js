export default ({ value }) => {
  let textArea
  function isOS () {
    return navigator.userAgent.match(/ipad|iphone/i)
  }

  function createTextArea (text) {
    textArea = document.createElement('textArea')
    textArea.value = text
    textArea.style.position = 'fixed'
    textArea.style.left = '50%'
    textArea.style.top = '50%'
    textArea.style.transform = 'translate(-50%, -50%)'
    textArea.onfocus = (e) => {
      e.preventDefault()
    }
    document.body.appendChild(textArea)
  }

  function selectText () {
    var range,
      selection

    if (isOS()) {
      range = document.createRange()
      range.selectNode(textArea)
      selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
      textArea.setSelectionRange(0, 999999)
    } else {
      textArea.select()
    }
  }

  function copyToClipboard () {
    document.execCommand('copy')
    textArea.blur()
    document.body.removeChild(textArea)
  }

  createTextArea(value)
  selectText()
  copyToClipboard()
}
