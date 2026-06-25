const redisUrl =
  process.env.UPSTASH_REDIS_REST_URL ||
  process.env.UPSTASH_REDIS_REST_KV_REST_API_URL;
const redisToken =
  process.env.UPSTASH_REDIS_REST_TOKEN ||
  process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN;
const attemptsKey = "growth99:wrong-attempts";

const redisCommand = async (...command) => {
  if (!redisUrl || !redisToken) {
    throw new Error("Redis environment variables are missing.");
  }

  const response = await fetch(`${redisUrl}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${redisToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([command]),
  });

  if (!response.ok) {
    throw new Error(`Redis request failed with status ${response.status}.`);
  }

  const [result] = await response.json();
  if (result.error) {
    throw new Error(result.error);
  }
  return result.result;
};

const sendJson = (response, statusCode, payload) => {
  response.status(statusCode).json(payload);
};

export default async function handler(request, response) {
  try {
    if (request.method === "GET") {
      const rawAttempts = await redisCommand("LRANGE", attemptsKey, 0, 49);
      const attempts = rawAttempts
        .map((item) => {
          try {
            return JSON.parse(item);
          } catch {
            return null;
          }
        })
        .filter(Boolean);

      return sendJson(response, 200, { attempts });
    }

    if (request.method === "POST") {
      const value = String(request.body?.value || "").trim();
      if (!value) {
        return sendJson(response, 400, { error: "Attempt value is required." });
      }

      const attempt = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        value,
        time: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
      };

      await redisCommand("LPUSH", attemptsKey, JSON.stringify(attempt));
      await redisCommand("LTRIM", attemptsKey, 0, 49);

      return sendJson(response, 201, { attempt });
    }

    if (request.method === "DELETE") {
      const id = String(request.query?.id || "");

      if (!id) {
        await redisCommand("DEL", attemptsKey);
        return sendJson(response, 200, { ok: true });
      }

      const rawAttempts = await redisCommand("LRANGE", attemptsKey, 0, 49);
      const attemptsToKeep = rawAttempts.filter((item) => {
        try {
          return JSON.parse(item).id !== id;
        } catch {
          return false;
        }
      });

      await redisCommand("DEL", attemptsKey);
      if (attemptsToKeep.length > 0) {
        await redisCommand("RPUSH", attemptsKey, ...attemptsToKeep);
      }

      return sendJson(response, 200, { ok: true });
    }

    response.setHeader("Allow", "GET, POST, DELETE");
    return sendJson(response, 405, { error: "Method not allowed." });
  } catch (error) {
    return sendJson(response, 500, {
      error: "Attempt storage is not configured.",
      detail: error.message,
    });
  }
}
