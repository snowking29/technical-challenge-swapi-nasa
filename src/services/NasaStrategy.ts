import fetch from "node-fetch";
import { IFusionStrategy } from "./IFusionStrategy";
import { NasaApod } from "../types/nasa";
import { Logger } from "../utils/Logger";

export class NasaStrategy implements IFusionStrategy<NasaApod> {
  private nasaApiKey = process.env.NASA_API_KEY || ''

  async fetchAndTransform(): Promise<NasaApod> {
    const res = await fetch(`https://api.nasa.gov/planetary/apod?api_key=${this.nasaApiKey}`);
    const data = await res.json();
    Logger.info(`Got Nasa data: ${JSON.stringify(data)}`)
    return {
      title: data.title,
      url: data.url,
      explanation: data.explanation,
      date: data.date
    };
  }
}
