import TaskModel, { TaskType } from "./Task.Model";

class TaskService {
    // Create a new task
    async createTask(data: {
      title: string;
      startTime: Date;
      endTime: Date;
      priority: number;
      status: 'pending' | 'finished';
    }): Promise<TaskType> {
      const { title, startTime, endTime, priority, status } = data;
  
      if (!['pending', 'finished'].includes(status)) {
        throw new Error('Invalid task status. Allowed values: pending, finished.');
      }
      if (priority < 1 || priority > 5) {
        throw new Error('Invalid priority value. Allowed range: 1-5.');
      }
  
      const task = new TaskModel({ title, startTime, endTime, priority, status });
      return await task.save();
    }
  
    // Update the task's status
    async updateTaskStatus(taskId: string, status: 'pending' | 'finished'): Promise<TaskType> {
      const task = await TaskModel.findById(taskId);
      if (!task) {
        throw new Error('Task not found');
      }
  
      if (status === 'finished') {
        task.status = 'finished';
        task.endTime = new Date(); // Update actual completion time
      }
  
      return await task.save();
    }
  
    // Get tasks with filtering and sorting
    async getTasks(
      filters: { priority?: number; status?: 'pending' | 'finished' },
      sortField: string = 'startTime',
      sortOrder: 'asc' | 'desc' = 'asc'
    ): Promise<TaskType[]> {
      const query: any = {};
  
      if (filters.priority) {
        query.priority = filters.priority;
      }
      if (filters.status) {
        query.status = filters.status;
      }
  
      const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
  
      return await TaskModel.find(query).sort({ [sortField]: sortOrderValue });
    }
  
    // Get dashboard statistics
    async getDashboardStatistics(): Promise<any> {
      const tasks = await TaskModel.find();
  
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(task => task.status === 'finished').length;
      const pendingTasks = tasks.filter(task => task.status === 'pending').length;
  
      const pendingByPriority = Array.from({ length: 5 }, (_, i) => {
        const priority = i + 1;
        const priorityTasks = tasks.filter(task => task.priority === priority && task.status === 'pending');
        const timeLapsed = priorityTasks.reduce((acc, task) => acc + (Date.now() - task.startTime.getTime()) / (1000 * 60 * 60), 0); // In hours
        const balanceEstimate = priorityTasks.reduce((acc, task) => {
          const remainingTime = (task.endTime.getTime() - Date.now()) / (1000 * 60 * 60);
          return acc + Math.max(remainingTime, 0);
        }, 0);
        return { priority, timeLapsed, balanceEstimate };
      });
  
      const avgCompletionTime =
        completedTasks > 0
          ? tasks
              .filter(task => task.status === 'finished')
              .reduce((acc, task) => acc + (task.endTime.getTime() - task.startTime.getTime()) / (1000 * 60 * 60), 0) /
            completedTasks
          : 0;
  
      return {
        totalCount: totalTasks,
        completedPercent: (completedTasks / totalTasks) * 100,
        pendingPercent: (pendingTasks / totalTasks) * 100,
        pendingByPriority,
        avgCompletionTime,
      };
    }
  }
  
  export default new TaskService();