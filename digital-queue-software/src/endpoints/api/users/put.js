import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import { insertUserQuery } from './queries';
import generateHash from '@ServerUtils/generate-hash';
import {
    SERVER_TIMEZONE, 
    DATETIME_FORMAT_MYSQL
} from '@ServerConstants';



const requiredFields = [
    'name', 'email', 'password', 'telephone',
    'document', 'documentType', 'nationality',
    'register'
];


export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);

        if (!validateReqBodyFields(reqBody)) {
            logger.info('Error in body fields, please check again');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
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
                '${reqBody.name}', '${reqBody.email}', '${generateHash(reqBody.password)}',
                '${reqBody.telephone}', '${reqBody.document}', '${reqBody.documentType}',
                '${reqBody.nationality}', '${moment().tz(SERVER_TIMEZONE()).format(DATETIME_FORMAT_MYSQL())}',
                '${reqBody.roleType}'
            )
        `;


        await mysql(query);


        logger.info('Success');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (PUT)/api/users');
        logger.info(error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
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
