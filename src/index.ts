import  express from 'express';
import * as dotenv from "dotenv";
import taskRouter from './controller/TaskController/Task.Routes';
import { connectDb } from './configs/mongoose.config';
import { auth } from './middleware/autth.middleware';
import userRouter from './controller/UserController/User.Routes';
import cors from "cors";
dotenv.config();
const server = express();
const port = process.env.PORT || 3000;
server.use(express.json());

const corsOptions = {
    origin: 'https://task-management-system-six-pied.vercel.app',  
  };
  
server.use(cors(corsOptions));

server.use("/api/v1/task",auth,taskRouter)
server.use("/api/v1/user",userRouter)


connectDb()

server.listen(port, () => {
    
    console.log(`Server running at http://localhost:${port}`);
});

