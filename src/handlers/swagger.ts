import { APIGatewayProxyHandler } from "aws-lambda";
import swaggerDocument from "../swagger.json";

export const handler: APIGatewayProxyHandler = async () => ({
  statusCode: 200,
  headers: { 
    "Content-Type": "application/json" 
  },
  body: JSON.stringify(swaggerDocument)
});
