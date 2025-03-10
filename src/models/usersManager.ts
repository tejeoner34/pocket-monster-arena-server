import { User } from '../models/user.js';

export class UsersManager {
  private users: Map<string, User> = new Map();

  createUser(userId: string): User {
    const newUser = new User(userId);
    this.users.set(userId, newUser);
    return newUser;
  }

  getUser(userId: string): User | undefined {
    return this.users.get(userId);
  }

  removeUser(userId: string) {
    const user = this.users.get(userId);
    if (user) {
      this.users.delete(userId);
      return user;
    }
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values());
  }

  hasUser(userId: string): boolean {
    return this.users.has(userId);
  }

  setUserCurrentRoomId(userId: string, roomId: string) {}
}
