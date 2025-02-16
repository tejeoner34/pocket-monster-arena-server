export class User {
  id: string;
  roomId: string | null;

  constructor(id: string) {
    this.id = id;
    this.roomId = null;
  }

  setRoom(roomId: string) {
    this.roomId = roomId;
  }
}
