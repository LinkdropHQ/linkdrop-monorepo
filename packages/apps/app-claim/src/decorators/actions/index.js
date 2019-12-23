import { connect } from 'react-redux'
import { withRouter } from 'react-router'

import Actions from 'data/actions'

export default map => {
  return (component) => {
    const { prototype } = component
    prototype.actions = function () { return this._actions || (this._actions = new Actions(this)) }
    prototype.api = function () { return this.actions().api }

    return withRouter(connect(map)(component))
  }
}
