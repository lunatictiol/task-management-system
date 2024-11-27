import  { Request, Response } from 'express';
import TaskService from '../../services/taskServices/Task.Service';
import { taskType } from '../../services/taskServices/Task.Model';

export const createTask = async (req:Request, res:Response) => {
    try { 
      const task = await TaskService.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }