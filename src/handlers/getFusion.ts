import { APIGatewayProxyHandler } from "aws-lambda";
import { FusionFacade } from "../services/FusionFacade";
import { Logger } from "../utils/Logger";

export const handler: APIGatewayProxyHandler = async (event: any) => {
  Logger.info(`test`)
  const characterId = event.queryStringParameters?.id;

  const facade = new FusionFacade(characterId);
  try {
    const data = await facade.getFusionedData();
    Logger.info(`Getting Data from Facade: ${JSON.stringify(data)}`)
    return { 
      statusCode: 200,
      body: JSON.stringify(data) 
    };
  } catch (err: any) {
    Logger.error(`Got an error in the execution: ${err}`)
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: err.message }) 
    };
  }
};
