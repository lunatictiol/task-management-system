import  express from 'express';
import * as dotenv from "dotenv";
import taskRouter from './controller/TaskController/Task.Routes';
import { connectDb } from './configs/mongoose.config';
import { auth } from './middleware/autth.middleware';
import userRouter from './controller/UserController/User.Routes';

dotenv.config();
const server = express();
const port = process.env.PORT || 3000;
server.use(express.json());

server.use("/api/v1/task",auth,taskRouter)
server.use("/api/v1/user",userRouter)

  
connectDb()

server.listen(port, () => {
    
    console.log(`Server running at http://localhost:${port}`);
});

