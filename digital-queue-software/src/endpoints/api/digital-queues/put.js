import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerUtils/validate-required-fields';
import { validateMysqlInteger } from '@ServerUtils/validate-mysql-types';
import { insertDigitalQueueQuery } from './queries';
import {
    SERVER_TIMEZONE, 
    DATETIME_FORMAT_MYSQL,
    DIGITAL_QUEUE_ID_REGEX
} from '@ServerConstants';



const requiredFields = [
    'id', 'name', 'isActive',
    'start', 'end', 'personTimeMinutes'
];


export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);

        if (!validateReqBodyFields(requiredFields, reqBody)) {
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

        if (!validateReqId(reqBody.id)) {
            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    message: 'Invalid id format'
                })
            };
        }



        const query = `
            ${insertDigitalQueueQuery}
            VALUES (
                '${reqBody.id}', '${reqBody.name}',
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


function validateReqId(value) {
    try {
        for (let i = 0; i < value.length; i++) {
            if (!value[i].match(DIGITAL_QUEUE_ID_REGEX())) {
                return false;
            }
        }

        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}
