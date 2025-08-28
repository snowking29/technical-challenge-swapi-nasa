import fetch from "node-fetch";
import { IFusionStrategy } from "./IFusionStrategy";
import { Spotify } from "../types/spotify";
import { Logger } from "../utils/Logger";

export class SpotifyStrategy implements IFusionStrategy<Spotify> {
  private character: string;
  private spotifyClientId = process.env.SPOTIFY_CLIENT_ID || '';
  private spotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';

  constructor(character?: string) {
    this.character = character || 'Darth Vader';
  }

  private async getSpotifyToken(): Promise<string> {
    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const credentials = Buffer.from(`${this.spotifyClientId}:${this.spotifyClientSecret}`).toString('base64');

    const res = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!res.ok) {
      const errorText = await res.text();
      Logger.error(`Error getting Spotify token: ${errorText}`);
      throw new Error('Failed to get Spotify token');
    }

    const data = await res.json();
    Logger.info(`Spotify token obtained`);
    return data.access_token;
  }

  private getThemeFromCharacter(character: string): string {
    const lower = character.toLowerCase().trim();
    if (lower === 'darth vader') return 'The Imperial March';
    return `${character}'s Theme`;
  }

  async fetchAndTransform(): Promise<Spotify> {
    const theme = this.getThemeFromCharacter(this.character);
    const searchQuery = `${theme} Star Wars`;

    const token = await this.getSpotifyToken();

    const search = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&market=ES&limit=1`,
      { 
        headers: { 
          Authorization: `Bearer ${token}` 
        } 
      }
    );

    if (!search.ok) {
      const errorText = await search.text();
      Logger.error(`Error searching Spotify track: ${errorText}`);
      throw new Error('Failed to search Spotify track');
    }

    const data = await search.json();
    const track = data.tracks.items[0];

    if (!track) {
      throw new Error(`No track found for theme: ${theme}`);
    }

    return {
      personaje: this.character,
      tema: track.name,
      artistas: track.artists.map((a: any) => a.name),
      album: track.album.name,
      release_date: track.album.release_date,
      duration_ms: track.duration_ms,
      spotify_url: track.external_urls.spotify,
      is_playable: track.is_playable
    };
  }
}
