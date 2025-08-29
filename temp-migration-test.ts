
import Redis from 'ioredis';
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  retryDelayOnFailover: 100
});

app.get('/profile', async (req, res) => {
  const userKey = `user:${req.session.userId}`;
  let userData = await redis.get(userKey);
  if (!userData) {
    userData = await fetchUserFromDB(req.session.userId);
    await redis.setex(userKey, 3600, JSON.stringify(userData));
  }
  res.json(JSON.parse(userData));
});
    