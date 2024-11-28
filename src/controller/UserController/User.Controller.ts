import  { Request, Response } from 'express';
import UserService from '../../services/userServices/User.Service';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../middleware/autth.middleware';

export const login = async (req:Request,res:Response) => {
  
    try {
      const { email, password } = req.body;
      if (!email || !password) {
         res.status(400).json({ error: 'Email and password are required.' });
      }
      const user = await UserService.login(email, password);
      const token = jwt.sign({ _id: user._id?.toString(), name: user.email }, SECRET_KEY, {
        expiresIn: '2 days',
      });
 
      res.status(200).json({ message: 'Login successful.', userId: user._id,token:token });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
}

export const register =async (req:Request,res:Response) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ error: 'Email and password are required.' });
      }
      const user = await UserService.register(email, password);
      const token = jwt.sign({ _id: user._id?.toString(), name: user.email }, SECRET_KEY, {
        expiresIn: '2 days',
      });
      res.status(201).json({ message: 'User registered successfully.', userId: user._id,token:token });
    } catch (error:any) {
      res.status(400).json({ error: error.message });
    }
  }




