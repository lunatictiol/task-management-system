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
        sortOrder: 'asc' | 'desc' = 'asc'
      ): Promise<(any)[]> {
        const query: any = {};
    
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



}

  

  




export default new TaskService();