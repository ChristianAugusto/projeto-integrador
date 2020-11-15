import {
    PUBLIC_PATH
} from '@ServerConstants';
import writeResponse from '@ServerModules/write-response';
import digitalQueue from '@ServerEndpoints/pages/pub/digital-queue';



export default function(app) {
    app.get('/admin/login', function(req, res) {
        res.sendFile(`${PUBLIC_PATH}/templates/pub-login.html`);
    });

    app.get('/filas/:digitalQueueId', async function(req, res) {
        writeResponse(await digitalQueue(req), res);
    });
}
