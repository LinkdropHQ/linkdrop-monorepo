import configs from '../../../../configs'
const mongoose = require('mongoose')

// Set up default mongoose connection
const connectDB = () => {
  const config = configs.get('server')
  return mongoose.connect(
    config.mongoURI || 'mongodb://localhost:27017/linkdrop_db',
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
}

export default connectDB
