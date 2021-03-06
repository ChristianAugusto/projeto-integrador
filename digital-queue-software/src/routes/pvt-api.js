import bodyParser from 'body-parser';

import writeResponse from '@ServerModules/write-response';
import {
    validateAdminApi, validateMasterApi
} from '@ServerGlobals/sessions';
import users from '@ServerEndpoints/api/pvt/users';
import logout from '@ServerEndpoints/api/pvt/logout';
import transports from '@ServerEndpoints/api/pvt/transports';
import digitalQueues from '@ServerEndpoints/api/pvt/digital-queues';
import digitalQueuesUsers from '@ServerEndpoints/api/pvt/digital-queues-users';



const jsonParser = bodyParser.json();



export default function(app) {
    app.post('/api/pvt/users', jsonParser, async function(req, res) {
        if ( (await validateMasterApi(req)) ) {
            writeResponse(await users.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/pvt/users', jsonParser, async function(req, res) {
        if ( (await validateMasterApi(req)) ) {
            writeResponse(await users.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });



    app.post('/api/pvt/transports', jsonParser, async function(req, res) {
        if (validateAdminApi(req)) {
            writeResponse(await transports.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/pvt/transports', jsonParser, async function(req, res) {
        if ( (await validateAdminApi(req)) ) {
            writeResponse(await transports.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });



    app.post('/api/pvt/digital-queues', jsonParser, async function(req, res) {
        if (validateAdminApi(req)) {
            writeResponse(await digitalQueues.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.put('/api/pvt/digital-queues', jsonParser, async function(req, res) {
        if (validateAdminApi(req)) {
            writeResponse(await digitalQueues.put(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.patch('/api/pvt/digital-queues', jsonParser, async function(req, res) {
        if (validateAdminApi(req)) {
            writeResponse(await digitalQueues.patch(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.delete('/api/pvt/digital-queues', jsonParser, async function(req, res) {
        if (validateAdminApi(req)) {
            writeResponse(await digitalQueues.$delete(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.post('/api/pvt/digital-queues/finish', jsonParser, async function(req, res) {
        if (validateAdminApi(req)) {
            writeResponse(await digitalQueues.finish(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });



    app.post('/api/pvt/digital-queues-users', jsonParser, async function(req, res) {
        if (validateAdminApi(req)) {
            writeResponse(await digitalQueuesUsers.post(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.patch('/api/pvt/digital-queues-users/attend', jsonParser, async function(req, res) {
        if (validateAdminApi(req)) {
            writeResponse(await digitalQueuesUsers.attend(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.delete('/api/pvt/digital-queues-users', jsonParser, async function(req, res) {
        if (validateAdminApi(req)) {
            writeResponse(await digitalQueuesUsers.$delete(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });



    app.post('/api/pvt/logout', jsonParser, async function(req, res) {
        writeResponse(await logout(req), res);
    });
}
