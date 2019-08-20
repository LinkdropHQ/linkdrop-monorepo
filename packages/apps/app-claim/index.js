import Application from 'components/application'
import React from 'react'
import ReactDOM from 'react-dom'
const elementContainer = document.getElementById('application')
const startApplication = Application => {
  ReactDOM.render(<Application />, elementContainer)

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./service-worker.js', { scope: '/' })
      .then(() => console.log('Service Worker registered successfully.'))
      .catch(error => console.log('Service Worker registration failed:', error))
  }
}

startApplication(Application)
