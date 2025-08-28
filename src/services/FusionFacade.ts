import { SwapiStrategy } from "./SwapiStrategy";
import { SpotifyStrategy } from "./SpotifyStrategy";
import { DynamoService } from "./DynamoService";
import { SwapiPerson } from "../types/swapi";
import { Spotify } from "../types/spotify";

export class FusionFacade {
  private swapi = new SwapiStrategy();
  private dynamo = new DynamoService();
  
  constructor(characterId?: string, characterName?: string) {
    this.swapi = new SwapiStrategy(characterId, characterName);
    this.dynamo = new DynamoService();
  }

  async getFusionedData(characterName?: string): Promise< SwapiPerson & Spotify & { timestamp: string }> {
    const cacheKey = this.getCacheKey(this.swapi['characterId'], characterName);
    
    const cached = await this.dynamo.getCache(cacheKey);
    if (cached) return cached;
  
    const swapiData = await this.swapi.fetchAndTransform();
    const spotifyCharacter = characterName || swapiData.name;
  
    const spotifyStrategy = new SpotifyStrategy(spotifyCharacter);
    const spotifyData = await spotifyStrategy.fetchAndTransform();

    const result = {
      ...swapiData,
      ...spotifyData,
      timestamp: new Date().toISOString()
    };
  
    await this.dynamo.setCache(cacheKey, result);
    await this.dynamo.saveItem({ ...result, type: "fusion" });
  
    return result;
  }

  private getCacheKey(characterId?: string, characterName?: string): string {
    if (characterId) return `fusionados_${characterId}`;
    if (characterName) return `fusionados_${characterName.replace(/\s+/g, '_')}`;
    return 'fusionados_default';
  }
}
