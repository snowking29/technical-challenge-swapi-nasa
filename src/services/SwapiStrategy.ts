import { IFusionStrategy } from "./IFusionStrategy";
import { SwapiPerson } from "../types/swapi";
import { Logger } from "../utils/Logger";
import fetch from "node-fetch";
import https from "https";

export class SwapiStrategy implements IFusionStrategy<SwapiPerson> {
  private baseUrl: string;

  constructor(private characterId?: string) {
    this.baseUrl = "https://swapi.dev/api";
  }

  async fetchAndTransform(): Promise<SwapiPerson> {
    const id = this.characterId || "1";
    const url = `${this.baseUrl}/people/${id}`;

    Logger.info(`Fetching character from URL: ${url}`);
    const agent = new https.Agent({ rejectUnauthorized: false });

    let data;
    try {
      const res = await fetch(url, { agent });
      data = await res.json();
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
