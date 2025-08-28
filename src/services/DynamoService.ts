import { DynamoDBClient, PutItemCommand, QueryCommand } from "@aws-sdk/client-dynamodb";
import { Logger } from "../utils/Logger";
export class DynamoService {
  private dynamoClient = new DynamoDBClient({
		region: process.env.AWS_REGION,
		endpoint: process.env.IS_OFFLINE === "true"
      ? "http://localhost:8000"
      : undefined
	});
  private tableName = process.env.DYNAMO_TABLE_NAME || "FusionTable";
  private cacheTTL = process.env.CACHE_TTL || 1800;

  async saveItem(item: any) {
		Logger.info(`🚀 Saving Item in Dynamo: ${JSON.stringify(item)}`)
    const command = new PutItemCommand({
      TableName: this.tableName,
      Item: {
        id: { S: item.id || new Date().toISOString() },
        type: { S: item.type || "custom" },
        payload: { S: JSON.stringify(item) },
        timestamp: { S: new Date().toISOString() }
      }
    });
    await this.dynamoClient.send(command);
		Logger.info(`✅ Item was saved in DynamoDB.`)
  }

  async getHistory(limit = 50) {
		Logger.info(`🚀 Getting History - Registers Limit: ${limit}`)
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "TimestampIndex",
      KeyConditionExpression: "#t = :type",
      ExpressionAttributeNames: {
        "#t": "type"
      },
      ExpressionAttributeValues: { 
        ":type": { 
          S: "fusion" 
        } 
      },
      ScanIndexForward: false,
      Limit: limit
    });
    Logger.info(`⚡ Sending commando to dynamoDB: ${command}`)
    const result = await this.dynamoClient.send(command);
    return result.Items?.map((i: { payload: { S: string; }; }) => JSON.parse(i.payload.S)) || [];
  }

  async getCache(key: string) {
		Logger.info(`🚀 Getting Cache - Key: ${key}`)
    const command = new QueryCommand({
      TableName: this.tableName,
      KeyConditionExpression: "id = :key AND #t = :type",
      ExpressionAttributeNames: {
        "#t": "type"
      },
      ExpressionAttributeValues: {
        ":key": { S: key },
        ":type": { S: "cache" }
      },
      Limit: 1
    });
    const result = await this.dynamoClient.send(command);
    if (!result.Items?.length) {
			Logger.info(`❌ Couldn't find results`)
			return null;
		}
    const item = result.Items[0];
    const cachedTime = new Date(item.timestamp.S!);
    if ((Date.now() - cachedTime.getTime()) / 1000 > Number(this.cacheTTL)) {
			Logger.info(`❌ Cache expired`)
      return null;
    }
    return JSON.parse(item.payload.S!);
  }

  async setCache(key: string, data: any) {
		Logger.info(`🟡 Setting Cache`)
    await this.saveItem({ id: key, type: "cache", payload: data });
  }
}
