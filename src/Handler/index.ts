import { Client } from "discord.js";

export default abstract class Handler {
  private _client: Client;
  constructor(client: Client) {
    this._client = client;
  }

  abstract handle(): void;

  public get client() {
    return this._client;
  }
}
