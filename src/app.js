import express from 'express';
import morgan from 'morgan';
import { createEntryRouter } from './routes/entries';
import { errorHandler } from './middleware/error-handler';
import { createHealthRouter } from './routes/health';
import helmet from 'helmet';
import { createEntryRateLimiter } from './middleware/create-entry-rate-limiter';

/**
 * Express application configured with request logging,
 * JSON body parsing, entry routes and central error handling.
 */
const app = express();

app.use(morgan('dev'));
app.use(helmet());
app.use('/api/entries', createEntryRateLimiter());
app.use(express.json());
app.use('/health', createHealthRouter());
app.use('/api/entries', createEntryRouter());
app.use(errorHandler);

export default app;
