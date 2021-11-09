import { FastifyReply, FastifyRequest } from "fastify";
import { Env, GlobalHookContainer, OnSend } from "fastify-boot";

@GlobalHookContainer
export class GlobalHook {
  @Env("ALLOW_ORIGIN")
  private allowOrigin!: string;

  constructor() {}

  @OnSend()
  public async addCorsHeaders(
    _: FastifyRequest,
    reply: FastifyReply,
    payload: any
  ): Promise<void> {
    reply.headers({
      "Access-Control-Allow-Origin": this.allowOrigin,
    });
    return payload;
  }
}
