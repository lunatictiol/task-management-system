import * as express from "express"
import { login, register } from "./User.Controller";

const userRouter = express.Router();

// Login a user
userRouter.post('/login',login);
// Register a new user
userRouter.post('/register',register);


export default userRouter;