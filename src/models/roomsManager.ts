import { Room } from './room.js';

export class RoomsManager {
  rooms: Map<string, Room> = new Map();

  async createRoom(userIds: string[]): Promise<Room> {
    const room = new Room();
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
    }
  }
}
