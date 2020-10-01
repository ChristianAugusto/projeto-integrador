import bodyParser from 'body-parser';

import { publicPATH, SESSION_COOKIE_NAME } from '@ServerConstants';
import writeResponse from '@ServerModules/write-response';
import { validateSession } from '@ServerGlobals/sessions';
import users from '@ServerEndpoints/api/users';
import login from '@ServerEndpoints/login';



const jsonParser = bodyParser.json();



export default function (app) {
    /* Pages */
    app.get('/', async function (req, res) {
        if (validateSession(req.cookies[SESSION_COOKIE_NAME()])) {
            res.sendFile(`${publicPATH()}/templates/home.html`);
        }
        else {
            res.redirect('/login');
        }
    });

    app.get('/login', async function (req, res) {
        if (validateSession(req.cookies[SESSION_COOKIE_NAME()])) {
            res.redirect('/');
        }
        else {
            res.sendFile(`${publicPATH()}/templates/login.html`);
        }
    });


    /* API(s) */
    app.post('/api/users', jsonParser, async function (req, res) {
        if (validateSession(req.cookies[SESSION_COOKIE_NAME()])) {
            writeResponse(await users.post(req), res);
        }
        else {
            res.redirect('/login');
        }
    });

    app.put('/api/users', jsonParser, async function (req, res) {
        if (validateSession(req.cookies[SESSION_COOKIE_NAME()])) {
            writeResponse(await users.put(req), res);
        }
        else {
            res.redirect('/login');
        }
    });

    app.post('/login', jsonParser, async function (req, res) {
        writeResponse(await login(req), res);
    });
}
