import {
    PUBLIC_PATH
} from '@ServerConstants';
import writeResponse from '@ServerModules/write-response';
import {
    validateAdminSession, validateMasterSession
} from '@ServerGlobals/sessions';
import digitalQueue from '@ServerEndpoints/pages/pvt/digital-queue';


export default function(app) {
    app.get('/admin/filas', async function(req, res) {
        if (validateAdminSession(req)) {
            res.sendFile(`${PUBLIC_PATH}/templates/pvt-admin.html`);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.get('/admin/criar-fila-digital', async function(req, res) {
        if (validateAdminSession(req)) {
            res.sendFile(`${PUBLIC_PATH}/templates/pvt-create-digital-queue.html`);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.get('/admin/filas/:digitalQueueId', async function(req, res) {
        if (validateAdminSession(req)) {
            writeResponse(await digitalQueue(req), res);
        }
        else {
            res.redirect('/admin/login');
        }
    });

    app.get('/admin/register', async function(req, res) {
        if (validateMasterSession(req)) {
            res.sendFile(`${PUBLIC_PATH}/templates/pvt-register.html`);
        }
        else {
            res.redirect('/admin/login');
        }
    });
}
