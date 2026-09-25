import { User } from '../types/messenger';
import { appStorage } from '../utils/storage';

class UserService {
  public getUsers(): User[] {
    return appStorage.getUsers();
  }

  public getUserById(id: string): User | undefined {
    return appStorage.getUsers().find(u => u.id === id);
  }

  public searchUsers(query: string, currentUserId: string): User[] {
    const q = query.trim().toLowerCase();
    const allUsers = appStorage.getUsers();
    if (!q) {
      return allUsers.filter(u => u.id !== currentUserId);
    }
    return allUsers.filter(
      u =>
        u.id !== currentUserId &&
        (u.displayName.toLowerCase().includes(q) ||
          u.username.toLowerCase().includes(q) ||
          (u.bio && u.bio.toLowerCase().includes(q)))
    );
  }

  public toggleBlockUser(userId: string): boolean {
    // For demo purposes, we can track blocked IDs
    return true;
  }
}

export const userService = new UserService();
