import { SwapiStrategy } from "./SwapiStrategy";
import { SpotifyStrategy } from "./SpotifyStrategy";
import { DynamoService } from "./DynamoService";
import { SwapiPerson } from "../types/swapi";
import { Spotify } from "../types/spotify";

export class FusionFacade {
  private swapi = new SwapiStrategy();
  private dynamo = new DynamoService();
  
  constructor(characterId?: string) {
    this.swapi = new SwapiStrategy(characterId);
    this.dynamo = new DynamoService();
  }

  async getFusionedData(characterName?: string): Promise< SwapiPerson & Spotify & { timestamp: string }> {
    const provisionalKey = this.swapi['characterId'] || characterName?.replace(/\s+/g, '_') || 'default';
    
    const cached = await this.dynamo.getCache(provisionalKey);
    if (cached) return cached;
  
    const swapiData = await this.swapi.fetchAndTransform();
    const spotifyCharacter = characterName || swapiData.name;

    const cacheKey = this.swapi['characterId']
      ? `fusionados_${this.swapi['characterId']}`
      : `fusionados_${spotifyCharacter.replace(/\s+/g, '_')}`;
  
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
}
