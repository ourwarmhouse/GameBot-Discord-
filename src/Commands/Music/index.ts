import Command from "../";

export default abstract class Music extends Command {
  constructor() {
    super();
    this._name = "music";
    this._alias = "m";
  }
}

export * from "./play";
