import mongoose, { Schema, Document } from 'mongoose';

export interface IChat extends Document {
  chatTopic: string;
  userId: mongoose.Types.ObjectId;
  timestamp: Date;
}

const chatSchema: Schema = new Schema({
  chatTopic: { type: String },
  userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema);