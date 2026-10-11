import express from 'express';
import morgan from 'morgan';
import { createEntryRouter } from './routes/entries';
import { errorHandler } from './middleware/error-handler';
/**
 * Express application configured with request logging,
 * JSON body parsing, entry routes and central error handling.
 */
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use('/api/entries', createEntryRouter());
app.use(errorHandler);


export default app;
