import 'regenerator-runtime';
import express from 'express';
import cookieParser from 'cookie-parser';

import { serverPORT, staticPATH } from '@ServerConstants';
import logger from '@ServerUtils/logger';
import routes from '@ServerRoutes';



const app = express();
const PORT = serverPORT();

app.use(express.static(staticPATH()));
app.use(cookieParser());

routes(app);

app.listen(PORT, '0.0.0.0', () => logger.warning(`Server running at port ${PORT}`));
