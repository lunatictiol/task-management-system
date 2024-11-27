import * as express from "express";
import { createTask } from "./Task.Controller";

const taskRouter = express.Router()

taskRouter.post('/create', createTask);


export default taskRouter;