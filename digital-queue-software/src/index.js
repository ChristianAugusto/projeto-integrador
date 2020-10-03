import 'regenerator-runtime';
import express from 'express';
import cookieParser from 'cookie-parser';

import { SERVER_PORT, STATIC_PATH } from '@ServerConstants';
import logger from '@ServerUtils/logger';
import routes from '@ServerRoutes';



const app = express();

app.use(express.static(STATIC_PATH));
app.use(cookieParser());

routes(app);

app.listen(SERVER_PORT, '0.0.0.0', () => logger.warning(`Server running at port ${SERVER_PORT}`));
