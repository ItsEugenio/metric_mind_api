import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3000'),
  nodeEnv: process.env.NODE_ENV || 'development',
  jwt: {
    secret: process.env.JWT_SECRET || 'your_secret_key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306'),
    username: process.env.DB_USERNAME || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_DATABASE || 'metric_mind_db',
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
};

const requiredEnvVars = ['JWT_SECRET', 'DB_PASSWORD'];

export const validateEnvironment = (): void => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('Variables de entorno faltantes:', missing.join(', '));
    console.error('Asegúrate de crear un archivo .env basado en env.example');
    process.exit(1);
  }
  
  console.log('Variables de entorno validadas correctamente');
};
