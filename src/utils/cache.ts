import { redis } from './redis';

export async function cacheMiddleware(req, res, next) {
  const key = ;
  const cachedBody = await redis.get(key);

  if (cachedBody) {
    return res.send(JSON.parse(cachedBody));
  } else {
    res.sendResponse = res.send;
    res.send = (body) => {
      redis.set(key, JSON.stringify(body), 'EX', 60);
      res.sendResponse(body);
    };
    next();
  }
}
