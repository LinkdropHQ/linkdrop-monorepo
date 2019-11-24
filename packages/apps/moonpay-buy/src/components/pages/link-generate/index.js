import React from 'react'
import { Page } from 'components/pages'
import ProcessPage from './process'
import Finished from './finished'
import { actions } from 'decorators'

@actions(({ link: { page } }) => ({ page }))
class LinkGenerate extends React.Component {
  render () {
    const { page } = this.props
    return <Page>
      {this.renderPage({ page })}
    </Page>
  }

  renderPage ({ page }) {
    switch (page) {
      case 'process':
        return <ProcessPage />
      case 'finished':
        return <Finished />
      default:
        return null
    }
  }
}

export default LinkGenerate
