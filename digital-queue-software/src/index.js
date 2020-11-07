import 'regenerator-runtime';
import express from 'express';
import cookieParser from 'cookie-parser';

import { SERVER_PORT, STATIC_PATH } from '@ServerConstants';
import logger from '@ServerUtils/logger';
import pubApi from '@ServerRoutes/pub-api';
import pvtApi from '@ServerRoutes/pvt-api';
import pubPages from '@ServerRoutes/pub-pages';
import pvtPages from '@ServerRoutes/pvt-pages';



const app = express();

app.use(express.static(STATIC_PATH));
app.use(cookieParser());

pubApi(app);
pvtApi(app);
pubPages(app);
pvtPages(app);

app.listen(SERVER_PORT, '0.0.0.0', () => logger.warning(`Server running at port ${SERVER_PORT}`));
