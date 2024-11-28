import * as express from "express";
import { createTask, deleteTasks, getTasks, getTaskwithTime, updateTask } from "./Task.Controller";

const taskRouter = express.Router()


//create task endpoint
taskRouter.post('/create', createTask);


//get tasks
taskRouter.get('/', getTasks);


//delete tasks
taskRouter.delete('/delete',deleteTasks );



//tasks with estimated time and timeelapsed
taskRouter.get('/detailed',getTaskwithTime );


// Partially update a task
taskRouter.patch('/:id',updateTask );
  

export default taskRouter;