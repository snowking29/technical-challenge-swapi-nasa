import { DynamoService } from "../services/DynamoService";
import { Logger } from "../utils/Logger";

export const handler = async (event: any) => {
  Logger.info(`PostResource - Raw Event: ${JSON.stringify(event)}`)
  try {
    const body = JSON.parse(event.body);
    const dynamo = new DynamoService();
    await dynamo.saveItem({ ...body, type: "custom" });

    Logger.info(`Returning success response`)
    return {
      statusCode: 200, 
      body: JSON.stringify({ success: true }) 
    };
  } catch (err: any) {
    Logger.error(`Got an error in the execution: ${err}`)
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: err.message })
    };
  }
};
