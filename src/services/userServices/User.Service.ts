import bcrypt from 'bcrypt';
import User, { UserType } from './User.Model';


class UserService {
  // Register a new user
  async register(email: string, password: string): Promise<UserType> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('Email is already registered.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword });
    return await user.save();
  }

  // Login a user
  async login(email: string, password: string): Promise<UserType> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid email or password.');
    }

    return user;
  }
}

export default new UserService();