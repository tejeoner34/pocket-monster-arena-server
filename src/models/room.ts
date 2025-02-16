export class Room {
  id: string;
  users: string[] = [];

  constructor(id: string) {
    this.id = id;
  }

  addUser(userId: string) {
    if (!this.users.includes(userId)) {
      this.users.push(userId);
    }
  }

  removeUser(userId: string) {
    this.users = this.users.filter((id) => id !== userId);
  }
}
