export class User {
  public readonly id: string;
  roomId: string | null;
  rivalId: string | null;

  constructor(id: string) {
    this.id = id;
    this.roomId = null;
    this.rivalId = null;
  }

  setRoom(roomId: string) {
    this.roomId = roomId;
  }

  setRivalId(rivalId: string) {
    this.rivalId = rivalId;
  }
}
