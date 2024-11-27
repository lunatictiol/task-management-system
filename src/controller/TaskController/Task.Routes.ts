import * as express from "express";
import { createTask, getTasks } from "./Task.Controller";

const taskRouter = express.Router()


//create task endpoint
taskRouter.post('/create', createTask);
taskRouter.get('/', getTasks);



export default taskRouter;