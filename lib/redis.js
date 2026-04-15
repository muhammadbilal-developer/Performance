import Redis from "ioredis";

const redisUrl = process.env.REDIS_URL;
const memoryCache = new Map();

let redisClient = null;

if (redisUrl) {
  redisClient = new Redis(redisUrl, {
    maxRetriesPerRequest: 1,
    enableReadyCheck: false,
    lazyConnect: true,
  });
}

async function ensureRedis() {
  if (!redisClient) return null;
  if (redisClient.status === "wait") {
    try {
      await redisClient.connect();
    } catch {
      return null;
    }
  }
  return redisClient;
}

export async function cacheGet(key) {
  const client = await ensureRedis();
  if (client) {
    const value = await client.get(key);
    return value ? JSON.parse(value) : null;
  }

  const inMemory = memoryCache.get(key);
  if (!inMemory || inMemory.exp < Date.now()) return null;
  return inMemory.value;
}

export async function cacheSet(key, value, ttlSeconds = 120) {
  const client = await ensureRedis();
  if (client) {
    await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
    return;
  }
  memoryCache.set(key, {
    value,
    exp: Date.now() + ttlSeconds * 1000,
  });
}

export async function cacheBumpVersion(namespace) {
  const key = `cache:version:${namespace}`;
  const client = await ensureRedis();
  if (client) {
    return client.incr(key);
  }
  const current = memoryCache.get(key)?.value || 0;
  const next = current + 1;
  memoryCache.set(key, { value: next, exp: Date.now() + 30 * 24 * 3600 * 1000 });
  return next;
}

export async function cacheGetVersion(namespace) {
  const key = `cache:version:${namespace}`;
  const client = await ensureRedis();
  if (client) {
    const value = await client.get(key);
    return Number(value || 1);
  }
  return Number(memoryCache.get(key)?.value || 1);
}

export async function incrementMetric(key) {
  const client = await ensureRedis();
  if (client) {
    return client.incr(key);
  }
  const current = memoryCache.get(key)?.value || 0;
  const next = current + 1;
  memoryCache.set(key, { value: next, exp: Date.now() + 30 * 24 * 3600 * 1000 });
  return next;
}

export async function readMetric(key) {
  const client = await ensureRedis();
  if (client) {
    const value = await client.get(key);
    return Number(value || 0);
  }
  return Number(memoryCache.get(key)?.value || 0);
}
