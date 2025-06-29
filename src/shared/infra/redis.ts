import { createClient } from "redis";

const client = createClient();

client.on("error", (err) => {
  console.log("Redis Client Error", err);
});

const connectToRedis = client.connect().then(() => {
  return client;
});

export { client, connectToRedis };
