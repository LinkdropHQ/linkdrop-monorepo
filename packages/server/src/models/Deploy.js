import { Schema, model } from 'mongoose'

const deploySchema = new Schema(
  {
    senderAddress: { type: String, required: true },
    linkdropContractAddress: { type: String, required: true },
    deployedAt: { type: Number, required: true, default: 0 },
    isWithdrawn: { type: Boolean, required: true, default: false }
  },
  { timestamps: true }
)

const Deploy = model('Deploy', deploySchema)

export default Deploy
