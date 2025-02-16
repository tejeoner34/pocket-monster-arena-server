import express, { Router } from 'express';
import { createServer } from 'http';
import { Server as IoServer } from 'socket.io';
import { setupSocketHandlers } from '../sockets/socketmanager.js';

type ServerOptionsType = {
  port: number;
  router: Router | null;
};

export class Server {
  public readonly app: express.Application = express();
  public readonly port: number = 3001;
  public readonly router: Router | null;

  constructor({ port, router }: ServerOptionsType) {
    this.port = port;
    this.router = router;
  }

  start() {
    const httpServer = createServer(this.app);
    const io = new IoServer(httpServer, {
      cors: { origin: '*' },
    });

    setupSocketHandlers(io);

    httpServer.listen(3001, () => {
      console.log('Server running on http://localhost:3001');
    });
  }
}
