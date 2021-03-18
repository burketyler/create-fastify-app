import { Injectable } from "fastify-boot";

@Injectable
export class Greeter {
  constructor() {}

  public sayHello(): string {
    return "Hello world!";
  }
}
