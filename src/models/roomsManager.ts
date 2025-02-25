import { Room } from './room.js';
import { User } from './user.js';

export class RoomsManager {
  rooms: Map<string, Room> = new Map();

  async createRoom(userIds: User[]): Promise<Room> {
    const room = new Room();
    userIds.forEach((user) => {
      const rivalId = userIds.find((u) => u.id !== user.id);
      user.setRivalId(rivalId!.id);
      user.setRoom(room.id);
    });
    await room.initialize(userIds);
    this.rooms.set(room.id, room);
    return room;
  }

  getRoom(id: string): Room | undefined {
    return this.rooms.get(id);
  }

  removeRoom(id: string) {
    this.rooms.delete(id);
  }

  getAllRooms() {
    return Array.from(this.rooms.values());
  }

  removeUserFromRoom(userId: string, roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.removeUser(userId);
      return room;
    }
  }
}
