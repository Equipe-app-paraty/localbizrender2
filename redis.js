const Redis = require("ioredis");

// Configuração mais robusta para o Redis no Render
const redis = new Redis({
  port: process.env.REDIS_PORT,
  host: process.env.REDIS_HOST,
  username: process.env.REDIS_USER,
  password: process.env.REDIS_PASSWORD,
  tls: {}, // Habilitar TLS para conexão segura (obrigatório no Render)
  connectTimeout: 10000, // Aumentar timeout de conexão para 10 segundos
  maxRetriesPerRequest: 5, // Reduzir número de tentativas por requisição
  retryStrategy: function(times) {
    const delay = Math.min(times * 100, 3000); // Aumentar gradualmente o tempo entre tentativas
    return delay;
  },
  reconnectOnError: function(err) {
    const targetError = 'READONLY';
    if (err.message.includes(targetError)) {
      return true; // Apenas reconectar em erros específicos
    }
    return false;
  }
});

// Tratamento adequado de eventos
redis.on("connect", () => console.log('Redis connected successfully'));
redis.on("error", (err) => console.error('Redis connection error:', err.message));
redis.on("reconnecting", () => console.log('Reconnecting to Redis...'));
redis.on("end", () => console.log('Redis connection ended'));

module.exports = redis;
