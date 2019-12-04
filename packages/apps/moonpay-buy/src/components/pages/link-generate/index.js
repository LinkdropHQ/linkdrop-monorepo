import React from 'react'
import { Page } from 'components/pages'
import ProcessPage from '../loading-screen'
import Finished from './finished'
import { actions, translate } from 'decorators'

@actions(({ link: { page } }) => ({ page }))
@translate('pages.linkGenerate')
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
        return <ProcessPage
          generateLink
          title={this.t('titles.main')}
        />
      case 'finished':
        return <Finished />
      default:
        return null
    }
  }
}

export default LinkGenerate
