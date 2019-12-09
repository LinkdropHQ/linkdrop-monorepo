import Application from 'components/application'
import React from 'react'
import ReactDOM from 'react-dom'
const elementContainer = document.getElementById('application')
const startApplication = Application => {
  ReactDOM.render(<Application />, elementContainer)
}

startApplication(Application)
