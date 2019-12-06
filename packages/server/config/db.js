import { MONGO_URI } from '../config/config.json'
const mongoose = require('mongoose')

// Set up default mongoose connection
export default () => {
  return mongoose.connect(
    MONGO_URI || 'mongodb://localhost:27017/linkdrop_db',
    {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true
    }
  )
}
