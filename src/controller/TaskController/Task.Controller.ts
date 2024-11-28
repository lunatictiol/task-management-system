import  { Request, Response } from 'express';
import TaskService from '../../services/taskServices/Task.Service';



//function called when create task is hit

export const createTask = async (req:Request, res:Response) => {
    try { 
        console.log(req.body)
        const task = await TaskService.createTask(req.body);
    
      res.status(201).json(task);
    } catch (e:any) {
      res.status(400).json({ error: e.message });
    }
}

//finction to get and filter the taskes
export const getTasks = async (req: Request, res: Response): Promise<void> => {
    try {
      const { priority, status, sortField, sortOrder } = req.query;
       
      // Parse query parameters
      const filters: { priority?: number; status?: 'pending' | 'finished' } = {};
      
      if (priority) filters.priority = parseInt(priority as string, 10);
      if (status) filters.status = status as 'pending' | 'finished';
      const validSortField: 'startTime' | 'endTime' = 
      sortField === 'endTime' ? 'endTime' : 'startTime';
      const tasks = await TaskService.getTasks(
        filters,
       validSortField,
        (sortOrder as 'asc' | 'desc') || 'asc',
        req.body.userId
      
    );
  
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }

 export const deleteTasks= async (req: Request, res: Response): Promise<void> => {
    try {
      const { tasksIds } = req.body;
  
      if (!Array.isArray(tasksIds) || tasksIds.length === 0) {
        res.status(400).json({ error: "IDs must be a non-empty array." });
        return;
      }
  
      const deletedCount = await TaskService.deleteTasks(tasksIds);
  
      res.status(200).json({ message: `${deletedCount} tasks deleted successfully.` });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }



  export const getTaskwithTime = async (req: Request, res: Response): Promise<void> => {
    try {
      const { priority, status, sortField = 'startTime', sortOrder = 'asc' } = req.query;
  
      const filters: { priority?: number; status?: 'pending' | 'finished' } = {};
      if (priority) filters.priority = parseInt(priority as string, 10);
      if (status) filters.status = status as 'pending' | 'finished';
  
      const tasks = await TaskService.getTasksWithComputedFields(filters, sortField as 'startTime' | 'endTime', sortOrder as 'asc' | 'desc', req.body.userId);
  
      res.status(200).json(tasks);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }



  export const updateTask = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;
  
      // Validate incoming updates
      const allowedUpdates = ['title', 'priority', 'status', 'endTime'];
      const isValidOperation = Object.keys(updates).every((key) =>
        allowedUpdates.includes(key)
      );
  
      if (!isValidOperation) {
        res.status(400).json({ error: 'Invalid updates!' });
        return;
      }
  
      // Handle `status` change logic if necessary
      if (updates.status === 'finished' && !updates.endTime) {
        updates.endTime = new Date(); // Automatically set `endTime` for completed tasks
      }
  
      const updatedTask = await TaskService.updateTask(id, updates);
  
      if (!updatedTask) {
        res.status(404).json({ error: 'Task not found!' });
        return;
      }
  
      res.status(200).json(updatedTask);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  }


  export const getDashboardStats = async (req:Request, res:Response) => {
    const { userId } = req.body;
    console.log(userId)
    try {
      const stats = await TaskService.getDashboardStatistics(userId);
      
      res.status(200).json(stats);
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }