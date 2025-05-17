const Redis = require("ioredis");

let redis;

// Prioriza a URL interna do Render, depois a externa, depois as variáveis avulsas
if (process.env.RENDER_INTERNAL_REDIS_URL) {
  redis = new Redis(process.env.RENDER_INTERNAL_REDIS_URL);
  console.log("Usando conexão interna do Render");
} else if (process.env.REDIS_EXTERNAL_URL) {
  redis = new Redis(process.env.REDIS_EXTERNAL_URL);
  console.log("Usando conexão externa do Render");
} else {
  redis = new Redis({
    port: process.env.REDIS_PORT,
    host: process.env.REDIS_HOST,
    username: process.env.REDIS_USER,
    password: process.env.REDIS_PASSWORD,
    tls: {}, // TLS obrigatório no Render
    connectTimeout: 10000,
    maxRetriesPerRequest: 5,
    retryStrategy: function(times) {
      const delay = Math.min(times * 100, 3000);
      return delay;
    },
    reconnectOnError: function(err) {
      const targetError = 'READONLY';
      if (err.message.includes(targetError)) {
        return true;
      }
      return false;
    }
  });
  console.log("Usando configuração manual de variáveis");
}

// Eventos de conexão
redis.on("connect", () => console.log('Redis connected successfully'));
redis.on("error", (err) => console.error('Redis connection error:', err.message));
redis.on("reconnecting", () => console.log('Reconnecting to Redis...'));
redis.on("end", () => console.log('Redis connection ended'));

module.exports = redis;
