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
    origin: 'http://localhost:5173/', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'application/json', 'Origin', 'X-Requested-With', 'Accept', 'x-client-key', 'x-client-token', 'x-client-secret', 'Authorization'],
    credentials: true
  };
  
server.use(cors(corsOptions));

server.use("/api/v1/task",auth,taskRouter)
server.use("/api/v1/user",userRouter)


connectDb()

server.listen(port, () => {
    
    console.log(`Server running at http://localhost:${port}`);
});

