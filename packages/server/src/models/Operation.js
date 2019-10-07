import mongoose from 'mongoose'
import TransactionSchema from './Transaction'

const OperationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      index: true,
      enum: ['claim', 'metatx']
    },
    id: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    transactions: [TransactionSchema],
    // data for the operation in unstructed format
    // as it's different for different operation types
    data: {
      type: Object
    },
    // should be equal to status of the latest transaction
    status: {
      type: String,
      required: true,
      default: 'created',
      enum: ['created', 'pending', 'completed', 'canceled', 'error']
    }
  },
  {
    timestamps: true
  }
)

const Operation = mongoose.model('Operation', OperationSchema)
export default Operation
