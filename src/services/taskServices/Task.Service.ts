import Task, { taskType } from "./Task.Model";



class TaskService {
  // Create a new task
  async createTask(data: {
    title: string;
    startTime: Date;
    endTime: Date;
    priority: number;
    status: 'pending' | 'finished';
  }): Promise<taskType> {
    const { title, startTime, endTime, priority, status } = data;

    if (!['pending', 'finished'].includes(status)) {
      throw new Error('Invalid task status. Allowed values: pending, finished.');
    }
    if (priority < 1 || priority > 5) {
      throw new Error('Invalid priority value. Allowed range: 1-5.');
    }

    const task = new Task({ title, startTime, endTime, priority, status });
    return await task.save();
  }
}

export default new TaskService();