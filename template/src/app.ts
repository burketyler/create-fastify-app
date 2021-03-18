import { FastifyInstance } from "fastify";
import { FastifyApplication, FastifyServer } from "fastify-boot";

@FastifyApplication
export class App {
  @FastifyServer()
  private server: FastifyInstance;

  constructor() {}

  public start(): void {
    this.server.listen(8080, "0.0.0.0", (err) => {
      if (err) {
        console.error(err);
      }
    });
  }
}
