import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import { insertUserQuery } from './queries';
import { SERVER_TIMEZONE } from '@ServerConstants';



const requiredFields = [
    'name', 'email', 'password', 'telephone',
    'document', 'documentType', 'nationality',
    'register'
];


export default async function(req) {
    try {
        const { body:reqBody } = req;

        if (!validateReqBodyFields(reqBody)) {
            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: 'Error in body fields, please check again'
                })
            };
        }

        /*
            TODO: Pegar roleType da seção e validar. Se for master, pode criar admin ou master,
            se for admin não pode criar.
        */
        reqBody.roleType = 'admin';


        const query = `
            ${insertUserQuery}
            VALUES (
                '${reqBody.name}', '${reqBody.email}', '${reqBody.password}',
                '${reqBody.telephone}', '${reqBody.document}', '${reqBody.documentType}',
                '${reqBody.nationality}', '${moment().tz(SERVER_TIMEZONE()).format('YYYY-MM-DD HH:mm:ss')}',
                '${reqBody.roleType}'
            )
        `;

        await mysql(query);


        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/users');
        logger.info(error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: 'Internal server error'
            })
        };
    }
}

function validateReqBodyFields(reqBody) {
    const reqBodyFields = Object.keys(reqBody);

    for (let i = 0; i < requiredFields.length; i++) {
        if (reqBodyFields.indexOf(requiredFields[i]) == -1) {
            return false;
        }
    }

    return true;
}
