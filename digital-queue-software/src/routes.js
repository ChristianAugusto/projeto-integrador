import bodyParser from 'body-parser';

import { PUBLIC_PATH, SESSION_COOKIE_NAME } from '@ServerConstants';
import writeResponse from '@ServerModules/write-response';
import { validateApiKey, validateSession } from '@ServerGlobals/sessions';
import users from '@ServerEndpoints/api/users';
import digitalQueues from '@ServerEndpoints/api/digital-queues';
import digitalQueuesUsers from '@ServerEndpoints/api/digital-queues-users';
import transports from '@ServerEndpoints/api/transports';
import login from '@ServerEndpoints/login';



const jsonParser = bodyParser.json();



export default function(app) {
    /* Pages */
    app.get('/', function(req, res) {
        res.sendFile(`${PUBLIC_PATH}/templates/home.html`);
    });

    app.get('/admin', async function(req, res) {
        if (validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            res.sendFile(`${PUBLIC_PATH}/templates/admin.html`);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.get('/admin/login', async function(req, res) {
        if (validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            res.redirect('/admin');
        }
        else {
            res.sendFile(`${PUBLIC_PATH}/templates/login.html`);
        }
    });


    /* API(s) */
    app.post('/api/users', jsonParser, async function(req, res) {
        if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            writeResponse(await users.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/users', jsonParser, async function(req, res) {
        if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            writeResponse(await users.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/digital-queues', jsonParser, async function(req, res) {
        if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            writeResponse(await digitalQueues.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.post('/api/digital-queues', jsonParser, async function(req, res) {
        if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            writeResponse(await digitalQueues.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/digital-queues-users', jsonParser, async function(req, res) {
        if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            writeResponse(await digitalQueuesUsers.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.post('/api/digital-queues-users', jsonParser, async function(req, res) {
        if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            writeResponse(await digitalQueuesUsers.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/transports', jsonParser, async function(req, res) {
        if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            writeResponse(await transports.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.post('/api/transports', jsonParser, async function(req, res) {
        if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
            writeResponse(await transports.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.post('/admin/login', jsonParser, async function(req, res) {
        writeResponse(await login(req), res);
    });
}
