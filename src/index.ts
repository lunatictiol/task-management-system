import  express from 'express';
import * as dotenv from "dotenv";
import taskRouter from './controller/TaskController/Task.Routes';
import { connectDb } from './configs/mongoose.config';
dotenv.config();
const server = express();
const port = process.env.PORT || 3000;
server.use(express.json());

server.use("/api/task",taskRouter)
connectDb()
server.listen(port, () => {
    
    console.log(`Server running at http://localhost:${port}`);
});