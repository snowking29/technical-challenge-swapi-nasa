import { IFusionStrategy } from "./IFusionStrategy";
import { SwapiPerson } from "../types/swapi";
import { Logger } from "../utils/Logger";
import fetch from "node-fetch";
import https from "https";

export class SwapiStrategy implements IFusionStrategy<SwapiPerson> {
  private baseUrl: string;
  private options: any = {};

  constructor(private characterId?: string) {
    if (process.env.IS_OFFLINE === "true") {
      this.baseUrl = "http://swapi.dev/api";
    } else {
      this.baseUrl = "https://swapi.dev/api";
      this.options.agent = new https.Agent({ rejectUnauthorized: true });
    }
  }

  async fetchAndTransform(): Promise<SwapiPerson> {
    const id = this.characterId || "1";
    const url = `${this.baseUrl}/people/${id}`;

    Logger.info(`IS_OFFLINE: ${process.env.IS_OFFLINE}`);
    Logger.info(`Fetching character from URL: ${url}`);

    if (process.env.IS_OFFLINE === "true") {
      try {
        const res = await fetch(url);
        const data = await res.json();
        Logger.info(`Got character from Swapi: ${JSON.stringify(data)}`);
        return {
          name: data.name,
          height: data.height,
          mass: data.mass,
          homeworld: data.homeworld
        };
      } catch (err: any) {
        Logger.info("SWAPI fetch failed in offline mode, returning mock character");
        return {
          name: "Luke Skywalker",
          height: "172",
          mass: "77",
          homeworld: "Tatooine"
        };
      }
    }

    // Fetch en producción con HTTPS
    const res = await fetch(url, this.options);
    const data = await res.json();
    Logger.info(`Got character from Swapi: ${JSON.stringify(data)}`);
    return {
      name: data.name,
      height: data.height,
      mass: data.mass,
      homeworld: data.homeworld
    };
  }
}
