import { resolve } from "fastify-boot";
import { App } from "./app";

const app = resolve<App>(App);

app.start();
