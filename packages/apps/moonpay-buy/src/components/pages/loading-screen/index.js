import React from 'react'
import { Page } from 'components/pages'
import { Loading } from '@linkdrop/ui-kit'

class LoadingScreen extends React.Component {
  render () {
    return <Page>
      <Loading />
    </Page>
  }
}

export default LoadingScreen
