import "./env";
import Koa, { DefaultState } from "koa";
import bodyParser from "koa-bodyparser";
import helmet from "koa-helmet";
import { Context } from "./core/contex";
import { corsMiddleware } from "./core/cors";
import { currentUserMiddleware } from "./core/currentUser";
import { initializeFirebase } from "./core/firebase";
import { applyJsonMiddleware } from "./core/json";
import "./core/yup";
import { operationRouter } from "./operation.router";

initializeFirebase();

const app = new Koa<DefaultState, Context>();

applyJsonMiddleware(app);
app.use(bodyParser());
app.use(helmet());
app.use(corsMiddleware());
app.use(currentUserMiddleware());
app.use(operationRouter.routes());

app.on("error", (error) => {
  console.error(error);
});

app.listen({ port: process.env.PORT }, () => {
  console.log(`🚀 Server ready at localhost:${process.env.PORT}`);
});
