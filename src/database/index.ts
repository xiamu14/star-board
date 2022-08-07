// db.ts
import Dexie, { Table } from "dexie";
import { Repo } from "./model/Repo";

const DatabaseName = "StarBoard";

export class MySubDexie extends Dexie {
  repos!: Table<Repo>;
  constructor() {
    super(DatabaseName);
    this.version(2.1).stores({
      repos: "++id, name, language, updatedAt",
    });
  }
}

export const db = new MySubDexie();
