import bodyParser from 'body-parser';

import { publicPATH } from '@ServerConstants';
import writeResponse from '@ServerModules/write-response';
import users from '@ServerEndpoints/api/users';



const jsonParser = bodyParser.json();



export default function (app) {
    /* Pages */
    app.get('/', async function (req, res) {
        res.sendFile(`${publicPATH()}/templates/home.html`);
    });


    /* API(s) */
    app.post('/api/users', jsonParser, async function (req, res) {
        writeResponse(await users.post(req), res);
    });

    app.put('/api/users', jsonParser, async function (req, res) {
        writeResponse(await users.put(req), res);
    });
}