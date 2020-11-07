import bodyParser from 'body-parser';

import writeResponse from '@ServerModules/write-response';
import {
    validateAdminSession, validateMasterSession
} from '@ServerGlobals/sessions';
import users from '@ServerEndpoints/api/pvt/users';
import transports from '@ServerEndpoints/api/pvt/transports';
import digitalQueues from '@ServerEndpoints/api/pvt/digital-queues';
import digitalQueuesUsers from '@ServerEndpoints/api/pvt/digital-queues-users';



const jsonParser = bodyParser.json();


export default function(app) {
    app.post('/api/pvt/users', jsonParser, async function(req, res) {
        if (validateAdminSession(req)) {
            writeResponse(await users.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/pvt/users', jsonParser, async function(req, res) {
        if ( (await validateMasterSession(req)) ) {
            writeResponse(await users.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });



    app.post('/api/pvt/transports', jsonParser, async function(req, res) {
        if (validateAdminSession(req)) {
            writeResponse(await transports.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/pvt/transports', jsonParser, async function(req, res) {
        if ( (await validateMasterSession(req)) ) {
            writeResponse(await transports.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });



    app.post('/api/pvt/digital-queues', jsonParser, async function(req, res) {
        if (validateAdminSession(req)) {
            writeResponse(await digitalQueues.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/pvt/digital-queues', jsonParser, async function(req, res) {
        if (validateAdminSession(req)) {
            writeResponse(await digitalQueues.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });



    app.post('/api/pvt/digital-queues-users', jsonParser, async function(req, res) {
        if (validateAdminSession(req)) {
            writeResponse(await digitalQueuesUsers.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });
}
