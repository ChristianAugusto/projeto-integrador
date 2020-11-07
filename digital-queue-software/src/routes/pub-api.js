import bodyParser from 'body-parser';

import writeResponse from '@ServerModules/write-response';
import digitalQueuePage from '@ServerEndpoints/api/pub/digital-queue-page';
import digitalQueuesUsers from '@ServerEndpoints/api/pub/digital-queues-users';
import login from '@ServerEndpoints/api/pub/login';



const jsonParser = bodyParser.json();


export default function(app) {
    app.post('/api/pub/digital-queue-page', jsonParser, async function(req, res) {
        writeResponse(await digitalQueuePage.post(req), res);
    });

    app.put('/api/pub/digital-queues-users', jsonParser, async function(req, res) {
        writeResponse(await digitalQueuesUsers.put(req), res);
    });

    app.post('/api/pub/login', jsonParser, async function(req, res) {
        writeResponse(await login(req), res);
    });
}
