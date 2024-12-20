import app from "./app";
import serverlessExpress from "@codegenie/serverless-express";
import "source-map-support/register";

let serverlessExpressApp: unknown; // type Handler aws-lambda

// @ts-ignore
export async function handler(event, context) {
  if (!serverlessExpressApp) {
    const expressApp = await app();
    serverlessExpressApp = serverlessExpress({ app: expressApp });
  }

  // @ts-expect-error
  return serverlessExpressApp(event, context);
}
