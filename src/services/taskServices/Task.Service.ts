import Task, { taskType } from "./Task.Model";

import  mongoose from 'mongoose';

class TaskService {
  // Create a new task
  async createTask(data: {
    title: string;
    startTime: Date;
    endTime: Date;
    priority: number;
    status: 'pending' | 'finished';
    userId: string;
  }): Promise<taskType> {
    const { title, startTime, endTime, priority, status,userId } = data;
    var newId:mongoose.Types.ObjectId = new mongoose.mongo.ObjectId(userId);
    if (!['pending', 'finished'].includes(status)) {
      throw new Error('Invalid task status. Allowed values: pending, finished.');
    }
    if (priority < 1 || priority > 5) {
      throw new Error('Invalid priority value. Allowed range: 1-5.');
    }
    console.log(userId)
    const task = new Task({ title, startTime, endTime, priority, status, userId: newId });
    return await task.save();
  }
}

export default new TaskService();