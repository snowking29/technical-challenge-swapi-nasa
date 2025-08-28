import { SwapiStrategy } from "./SwapiStrategy";
import { NasaStrategy } from "./NasaStrategy";
import { DynamoService } from "./DynamoService";
import { SwapiPerson } from "../types/swapi";
import { NasaApod } from "../types/nasa";

export class FusionFacade {
  private swapi = new SwapiStrategy();
  private nasa = new NasaStrategy();
  private dynamo = new DynamoService();
  
  constructor(characterId?: string) {
    this.swapi = new SwapiStrategy(characterId)
  }

  async getFusionedData(): Promise<{ swapi: SwapiPerson; nasa: NasaApod; timestamp: string }> {
    const cacheKey = `fusionados_${this.swapi['characterId'] || '1'}`;
    
    const cached = await this.dynamo.getCache(cacheKey);
    if (cached) return cached;
  
    const [swapiData, nasaData] = await Promise.all([
      this.swapi.fetchAndTransform(),
      this.nasa.fetchAndTransform()
    ]);
  
    const result = { 
    	swapi: swapiData, 
    	nasa: nasaData, 
    	timestamp: new Date().toISOString()
    };
  
    await this.dynamo.setCache(cacheKey, result);
    await this.dynamo.saveItem({ ...result, type: "fusion" });
  
    return result;
  }
}
