import connectToParent from 'penpal/lib/connectToParent'
const EventEmitter = require('events')

class WidgetService {
  constructor () {
    this.eventEmitter = new EventEmitter()
    this.connected = false
    this.on = this.eventEmitter.on
    this.communication = null
  }

  async connectToDapp ({ methods }) {
    if (!this.connected) {
      const connection = connectToParent({
        // Methods child is exposing to parent
        // temp hack: receiving methods from React app
        methods
      })

      this.communication = await connection.promise
      this.connected = true
      console.log("widget connected to app")
    }
  }

  hideWidget () {
    if (this.connected) { 
      this.communication.hideWidget()
    }
  }

  showWidget () {
    if (this.connected) {     
      this.communication.showWidget()
    }
  }

  onCloseClick () {
    this.eventEmitter.emit('userAction', { action: 'cancel', payload: null })
  }

  onConfirmClick (result) {
    this.eventEmitter.emit('userAction', { action: 'confirm', payload: result })
  }   
}

const widgetService = new WidgetService()
export default widgetService
