import * as mongoose from 'mongoose'
import {Model, Document, Schema, Types} from 'mongoose';

export interface Tokens extends Document {
  mint: string
  allstar: boolean
  airdropTokens: bigint
  allstarTokens: bigint
  recipients: string[]
  recipientsTokens: bigint[] 
}

const TokenSchema = new Schema<Tokens>({
  mint: {
    type: String,
    required: true,
    unique: true
  },
  allstar: {
    type: Boolean,
    required: true
  },
  airdropTokens: {
    type: BigInt,
  },
  allstarTokens: {
    type: BigInt,
  },
  recipients: {
    type: [String]
  },
  recipientsTokens: {
    type: [BigInt]
  }
})

export default mongoose.models.Token as Model<Tokens, {}, {}, {}, Document<unknown, {}, Tokens> & Tokens & { _id: Types.ObjectId; }, any> || mongoose.model<Tokens>('Token', TokenSchema)