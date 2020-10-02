import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import { validateMysqlInteger } from '@ServerUtils/validate-mysql-types';
import { insertDigitalQueueQuery } from './queries';
import {
    SERVER_TIMEZONE, 
    DATETIME_FORMAT_MYSQL
} from '@ServerConstants';



const requiredFields = [
    'id', 'name', 'isActive',
    'start', 'end', 'personTimeMinutes'
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

        if (!validateMysqlInteger(reqBody.personTimeMinutes)) {
            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    message: 'Invalid personTimeMinutes type'
                })
            };
        }


        const query = `
            ${insertDigitalQueueQuery}
            VALUES (
                '${reqBody.name}', '${reqBody.slug}',
                '${moment().tz(SERVER_TIMEZONE()).format(DATETIME_FORMAT_MYSQL())}',
                ${reqBody.isActive ? 1 : 0}, '${reqBody.start}', '${reqBody.end}',
                ${reqBody.personTimeMinutes}
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
        logger.error('Error in (PUT)/api/digital-queues');
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
