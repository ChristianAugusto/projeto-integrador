import 'regenerator-runtime';
import express from 'express';

import { serverPORT, staticPATH } from '@Constants';
import logger from '@Utils/logger';
import routes from '@Routes';



const app = express();
const PORT = serverPORT();

app.use(express.static(staticPATH()));

routes(app);

app.listen(PORT, '0.0.0.0', () => logger.warning(`Server running at port ${PORT}`));
