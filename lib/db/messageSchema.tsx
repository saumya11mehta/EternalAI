import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  messageBy: string;
  messageContent: string;
  timestamp: Date;
  chatId: mongoose.Types.ObjectId;
}

const messageSchema: Schema = new Schema({
  messageBy: { type: String, required: true },
  messageContent: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  chatId: { type: mongoose.Types.ObjectId, ref: 'Chat', required: true }
});

export default mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);