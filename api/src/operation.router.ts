import { AllOperationName, AllOperations } from "@animeaux/shared";
import Router from "koa-router";
import { mixed, object, ValidationError } from "yup";
import {
  OperationError,
  OperationImpl,
  OperationsImpl,
} from "./core/operations";
import { animalOperations } from "./operations/animal.operation";
import { animalBreedOperations } from "./operations/animalBreed.operation";
import { animalColorOperations } from "./operations/animalColor.operation";
import { currentUserOperations } from "./operations/currentUser.operation";
import { eventOperations } from "./operations/event.operation";
import { fosterFamilyOperations } from "./operations/fosterFamily.operation";
import { imageOperations } from "./operations/image.operation";
import { userOperations } from "./operations/user.operation";

const allOperations: OperationsImpl<AllOperations> = {
  ...currentUserOperations,
  ...userOperations,
  ...animalColorOperations,
  ...animalBreedOperations,
  ...fosterFamilyOperations,
  ...animalOperations,
  ...imageOperations,
  ...eventOperations,
};

export const operationRouter = new Router();

operationRouter.post("/operation", async (context, next) => {
  try {
    const { name, params } = bodySchema.validateSync(context.request.body);
    const operation: OperationImpl = allOperations[name];
    context.body = await operation(params, context);
  } catch (error) {
    if (error instanceof ValidationError) {
      context.status = 400;
    } else if (error instanceof OperationError) {
      context.body = error.errorBody;
      context.status = error.status;
    } else {
      console.error("Unexpected operation error:", error);
      context.status = 500;
    }
  }

  return next();
});

const bodySchema = object({
  name: mixed<AllOperationName>()
    .oneOf(Object.keys(allOperations) as AllOperationName[])
    .required(),
  params: object(),
});
