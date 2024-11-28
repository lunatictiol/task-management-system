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


  //get tasks

  async getTasks(
    filters: { priority?: number; status?: 'pending' | 'finished' },
    sortField:'startTime' | "endTime"  = 'startTime',
    sortOrder: 'asc' | 'desc' = 'asc',
    userId:string
  ): Promise<taskType[]> {
    console.log(userId)
    const query: any = {};
    query.userId = new mongoose.Types.ObjectId(userId)
    if (filters.priority) {
      query.priority = filters.priority;
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
    return await Task.find(query).sort({ [sortField]: sortOrderValue });
  }

  //delete tasks

  async deleteTasks(IDs: string[]): Promise<number>{
    if (!IDs || IDs.length === 0) {
        throw new Error("User IDs array must not be empty.");
      }
      const result = await Task.deleteMany({ _id: { $in: IDs }}); 
      return result.deletedCount; 
    }
  


    //data about estimated time and time elapsed 
    async getTasksWithComputedFields(
        filters: { priority?: number; status?: 'pending' | 'finished' },
        sortField: 'startTime' | 'endTime' = 'startTime',
        sortOrder: 'asc' | 'desc' = 'asc',
        userId:string
      ): Promise<(any)[]> {
        const query: any = {};
        query.userId = new mongoose.Types.ObjectId(userId)
        if (filters.priority) query.priority = filters.priority;
        if (filters.status) query.status = filters.status;
    
        const sortOrderValue = sortOrder === 'asc' ? 1 : -1;
    
        const tasks = await Task.find(query).sort({ [sortField]: sortOrderValue });
    
        const currentTime = new Date();
    
       const data = tasks.map((task) => {
          let timeLapsed = 0;
          let estimatedTimeLeft = 0;
    
          if (task.status === 'pending') {
            // Time lapsed = currentTime - startTime
            timeLapsed = Math.max(0, (currentTime.getTime() - task.startTime.getTime()) / (1000 * 60 * 60)); // in hours
    
            // Estimated time left = endTime - currentTime (or 0 if past endTime)
            estimatedTimeLeft = Math.max(0, (task.endTime.getTime() - currentTime.getTime()) / (1000 * 60 * 60)); // in hours
          }
    
          return {
            ...task.toObject(),
            timeLapsed,
            estimatedTimeLeft,
          };
        })
        ;
       return data
      }



      // Update a task partially
  async updateTask(id: string, updates: Partial<taskType>): Promise<taskType | null> {
    const task = await Task.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true } // Return the updated document and validate updates
    );
    return task;
  }

   // Get dashboard statistics
   async getDashboardStatistics(userId:string): Promise<any> {
    const query: any = {};
    query.userId = new mongoose.Types.ObjectId(userId)
    const tasks = await Task.find(query);
    console.log(tasks)

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