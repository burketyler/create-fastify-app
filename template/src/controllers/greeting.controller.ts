import { FastifyReply, FastifyRequest } from "fastify";
import { Greeter } from "../services/greeter";
import { Controller, GetMapping } from "fastify-boot";

@Controller("/")
export class GreetingController {
  constructor(private service: Greeter) {}

  @GetMapping("/hello")
  public async getHello(
    request: FastifyRequest,
    reply: FastifyReply
  ): Promise<void> {
    reply.status(200).send({ greeting: this.service.sayHello() });
  }
}
