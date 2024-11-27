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

