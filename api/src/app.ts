import Koa from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import invariant from "tiny-invariant";
import { corsMiddleware } from "./core/cors";
import { applyJsonMiddleware } from "./core/json";
import "./core/yup";
import { healthRouter } from "./health.router";
import { operationRouter } from "./operation.router";

invariant(process.env.NODE_ENV != null, "NODE_ENV must be defined.");
invariant(process.env.PORT != null, "PORT must be defined.");

const app = new Koa({
  // In production Fly has a proxy.
  proxy: process.env.NODE_ENV === "production",
});

applyJsonMiddleware(app);
app.use(bodyParser());
app.use(helmet());
app.use(corsMiddleware());
app.use(healthRouter.routes());
app.use(operationRouter.routes());

app.on("error", (error) => {
  console.error(error);
});

const server = app.listen({ port: process.env.PORT }, () => {
  console.log(`🚀 Server ready at localhost:${process.env.PORT}`);
});

function closeServer() {
  console.log("🛑 Stopping server");
  return server.close();
}

process.once("SIGINT", closeServer);
process.once("SIGTERM", closeServer);
