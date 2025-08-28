import { DynamoService } from "../services/DynamoService";
import { Logger } from "../utils/Logger";

export const handler = async () => {
  try {
    Logger.info(`Getting history`)
    const dynamo = new DynamoService();
    const history = await dynamo.getHistory();

    Logger.info(`Returning succcess response: ${JSON.stringify(history)}`)
    return { 
      statusCode: 200, 
      body: JSON.stringify(history) 
    };
  } catch (err: any) {
    Logger.error(`Got an error in the execution: ${err}`)
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: err.message }) 
    };
  }
};
