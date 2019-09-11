import React from 'react'
import ReactGA from 'react-ga'

class GAListener extends React.Component {
  componentDidMount () {
    ReactGA.initialize('UA-145194373-3')
    const { history } = this.props
    this.sendPageView(history.location)
    history.listen(this.sendPageView)
  }

  sendPageView (location) {
    ReactGA.set({ page: location.hash })
    ReactGA.pageview(location.hash)
  }

  render () {
    return this.props.children
  }
}

export default GAListener
