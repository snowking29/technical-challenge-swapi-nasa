import { IFusionStrategy } from "./IFusionStrategy";
import { SwapiPerson } from "../types/swapi";
import { Logger } from "../utils/Logger";
import fetch from "node-fetch";
import https from "https";

export class SwapiStrategy implements IFusionStrategy<SwapiPerson> {
  private baseUrl: string;
  private characterName?: string;

  constructor(private characterId?: string , characterName?: string) {
    this.baseUrl = process.env.SWAPI_ENDOPINT || "https://swapi.dev/api";
    this.characterName = characterName;
  }

  async fetchAndTransform(): Promise<SwapiPerson> {
    Logger.info(`Fetching SWAPI character - ID: ${this.characterId}, Name: ${this.characterName}`);
    const agent = new https.Agent({ rejectUnauthorized: false });
    let data;

    try {
      if (this.characterId) {

        const url = `${this.baseUrl}/people/${this.characterId}`;
        Logger.info(`Fetching character by ID from URL: ${url}`);
        const res = await fetch(url, { agent });
        data = await res.json();

      } else if (this.characterName) {
        const url = `${this.baseUrl}/people/?search=${encodeURIComponent(this.characterName)}`;
        Logger.info(`Searching character by name from URL: ${url}`);

        const res = await fetch(url, { agent });
        const json = await res.json();
        data = json.results?.[0];

        if (!data) throw new Error(`Character not found in SWAPI: ${this.characterName}`);
      } else {
        throw new Error('No character ID or name provided');
      }
    } catch (err) {
      Logger.error(err);
      throw err;
    }
    
    Logger.info(`Got character from Swapi: ${JSON.stringify(data)}`);
    return {
      name: data.name,
      height: data.height,
      mass: data.mass,
      hair_color: data.hair_color,
      skin_color: data.skin_color,
      eye_color: data.eye_color,
      birth_year: data.birth_year,
      gender: data.gender
    };
  }
}
