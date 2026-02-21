import {createClient} from "redis"


const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD,
});

redisClient.on("connect", () => {
  console.log("Redis connected");
});

redisClient.on("error", (err) => {
  console.error("Redis error", err);
});

 export async function connectRedis() {
  if (!redisClient.isOpen) {
    await redisClient.connect();
  }
}


export default redisClient;
