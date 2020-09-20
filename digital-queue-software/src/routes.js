// import bodyParser from 'body-parser';

import writeResponse from '@Modules/write-response';
import home from '@Endpoints/home';



// const jsonParser = bodyParser.json();



export default function(app) {
    /* API(s) */

    /* Api route */
    app.get('/', async function(req, res) {
        writeResponse(await home(), res);
    });
}
