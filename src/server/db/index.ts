import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URL || "");
let connected = false;

const DB = "reviews-plethora";

export async function getDB() {
  if (connected) return client.db(DB);
  await client.connect();
  connected = true;
  return client.db(DB);
}
