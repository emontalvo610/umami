import { ok, unauthorized, badRequest, checkPassword, createSecureToken } from 'next-basics';
import { getUser } from 'queries';
import { secret } from 'lib/crypto';
import redis from 'lib/redis';
import { generateAuthToken } from 'lib/auth';

export default async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return badRequest(res);
  }

  const user = await getUser({ username });

  if (user && checkPassword(password, user.password)) {
    if (redis.enabled) {
      const token = generateAuthToken();

      await redis.set(token, user);

      return ok(res, { token, user });
    }

    const { id: userId, username, isAdmin } = user;
    const token = createSecureToken({ userId, username, isAdmin }, secret());

    return ok(res, { token, user });
  }

  return unauthorized(res);
};
