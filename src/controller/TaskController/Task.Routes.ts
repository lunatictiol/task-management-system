import * as express from "express";
import { createTask, deleteTasks, getDashboardStats, getTasks, getTaskwithTime, updateTask } from "./Task.Controller";

const taskRouter = express.Router()


//create task endpoint
taskRouter.post('/create', createTask);


//get tasks
taskRouter.get('/', getTasks);


//delete tasks
taskRouter.post('/delete',deleteTasks );



//tasks with estimated time and timeelapsed
taskRouter.post('/detailed',getTaskwithTime );


// Partially update a task
taskRouter.patch('/:id',updateTask );

// Get dashboard statistics
taskRouter.post('/dashboard',getDashboardStats );
  

export default taskRouter;