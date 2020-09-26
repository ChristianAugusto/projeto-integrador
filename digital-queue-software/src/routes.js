// import bodyParser from 'body-parser';

import { publicPATH } from '@Constants';
import writeResponse from '@Modules/write-response';
import test from '@Endpoints/api/test';



// const jsonParser = bodyParser.json();



export default function (app) {
    /* Pages */
    app.get('/', async function (req, res) {
        res.sendFile(`${publicPATH()}/templates/home.html`);
    });


    /* API(s) */
    app.get('/api', async function (req, res) {
        writeResponse(await test(), res);
    });
}