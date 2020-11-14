import {
    PUBLIC_PATH
} from '@ServerConstants';
import writeResponse from '@ServerModules/write-response';
import {
    validateAdminPage, validateMasterPage
} from '@ServerGlobals/sessions';
import digitalQueue from '@ServerEndpoints/pages/pvt/digital-queue';
import admin from '@ServerEndpoints/pages/pvt/admin';



export default function(app) {
    app.get('/admin', async function(req, res) {
        if (validateAdminPage(req)) {
            writeResponse(await admin(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.get('/admin/filas', async function(req, res) {
        if (validateAdminPage(req)) {
            res.sendFile(`${PUBLIC_PATH}/templates/pvt-admin-digital-queues.html`);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.get('/admin/criar-fila-digital', async function(req, res) {
        if (validateAdminPage(req)) {
            res.sendFile(`${PUBLIC_PATH}/templates/pvt-create-digital-queue.html`);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.get('/admin/filas/:digitalQueueId', async function(req, res) {
        if (validateAdminPage(req)) {
            writeResponse(await digitalQueue(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.get('/admin/register', async function(req, res) {
        if (validateMasterPage(req)) {
            res.sendFile(`${PUBLIC_PATH}/templates/pvt-register.html`);
        }
        else {
            res.redirect('/admin/login');
        }
    });
}
