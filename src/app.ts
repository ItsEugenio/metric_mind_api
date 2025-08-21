import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config, validateEnvironment } from './config/environment';
import { initializeDatabase } from './config/database';
import { generalLimiter } from './middleware/rateLimiter';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from './routes';

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    this.app.use(helmet());

    this.app.use(cors({
      origin: config.cors.origin,
      credentials: true,
      optionsSuccessStatus: 200,
    }));

    this.app.use(generalLimiter);

    this.app.use(morgan(config.nodeEnv === 'production' ? 'combined' : 'dev'));

    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    this.app.use((req, res, next) => {
      res.header('X-API-Version', '1.0.0');
      next();
    });
  }

  private initializeRoutes(): void {
    this.app.get('/', (req, res) => {
      res.json({
        message: '🏥 API de Dashboard de Hábitos y Salud',
        version: '1.0.0',
        documentation: '/api/v1/health-check',
        timestamp: new Date().toISOString(),
      });
    });

    this.app.use('/api/v1', routes);
  }

  private initializeErrorHandling(): void {
    this.app.use('*', notFoundHandler);

    this.app.use(errorHandler);
  }

  public async start(): Promise<void> {
    try {
      validateEnvironment();

      await initializeDatabase();

      this.app.listen(config.port, () => {
        console.log(`Servidor iniciado en puerto ${config.port}`);
        console.log(`Entorno: ${config.nodeEnv}`);
        console.log(`URL: http://localhost:${config.port}`);
        console.log(`Health Check: http://localhost:${config.port}/api/v1/health-check`);
        console.log('API de Dashboard de Hábitos y Salud lista para usar');
      });
    } catch (error) {
      console.error('Error al iniciar la aplicación:', error);
      process.exit(1);
    }
  }
}

const app = new App();

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

app.start();

export default app;
