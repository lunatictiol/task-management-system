import  { Request, Response } from 'express';
import TaskService from '../../services/taskServices/Task.Service';
import { taskType } from '../../services/taskServices/Task.Model';


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

