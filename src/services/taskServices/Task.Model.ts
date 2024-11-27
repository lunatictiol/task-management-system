import mongoose, { Schema, Document } from 'mongoose';

export interface TaskType extends Document {
  title: string;
  startTime: Date;
  endTime: Date;
  priority: number;
  status: 'pending' | 'finished';
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  priority: { type: Number, required: true, min: 1, max: 5 },
  status: { type: String, required: true, enum: ['pending', 'finished'] },
});

export default mongoose.model<TaskType>('Task', TaskSchema);