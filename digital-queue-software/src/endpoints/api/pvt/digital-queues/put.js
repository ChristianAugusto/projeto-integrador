import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';
import validateTransports from '@ServerModules/validate-transports';
import {
    SERVER_TIMEZONE, 
    DATETIME_FORMAT_MYSQL,
    DIGITAL_QUEUE_ID_REGEX,
    INSERT_DIGITAL_QUEUE_QUERY,
    INSERT_DIGITAL_QUEUE_TRANSPORTS_QUERY
} from '@ServerConstants';



const requiredFields = [
    'id', 'name', 'isActive', 'day',
    'start', 'end', 'userTimeMinutes',
    'transportsIds'
];


export default async function(req) {
    try {
        logger.info('Starting (PUT)/api/pvt/digital-queues');


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
                    created: false,
                    message: 'Error in body fields, please check again'
                })
            };
        }

        if (!validateMysqlInteger(reqBody.userTimeMinutes)) {
            logger.info('Invalid userTimeMinutes type');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: 'Invalid userTimeMinutes type'
                })
            };
        }

        if (Number(reqBody.userTimeMinutes) < 1) {
            logger.info('userTimeMinutes can not be negative');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: 'userTimeMinutes can not be negative'
                })
            };
        }

        if (!validateReqId(reqBody.id)) {
            logger.info('Invalid id format');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: 'Invalid id format'
                })
            };
        }

        if (!(await validateTransports(reqBody.transportsIds))) {
            logger.info('1 or more transports id(s) is invalid');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: '1 or more transports id(s) is invalid'
                })
            };
        }



        const query1 = `
            ${INSERT_DIGITAL_QUEUE_QUERY}
            VALUES (
                '${reqBody.id}', '${reqBody.name}',
                '${moment().tz(SERVER_TIMEZONE()).format(DATETIME_FORMAT_MYSQL)}',
                ${reqBody.isActive ? 1 : 0}, 0, '${reqBody.day}', '${reqBody.start}',
                '${reqBody.end}', ${reqBody.userTimeMinutes}
            )
        `;

        await mysql(query1);


        for (let i = 0; i < reqBody.transportsIds.length; i++) {
            const digitalQueueTransportQuery = `
                ${INSERT_DIGITAL_QUEUE_TRANSPORTS_QUERY}
                VALUES (
                    '${reqBody.id}', ${reqBody.transportsIds[i]}
                )
            `;

            await mysql(digitalQueueTransportQuery);
        }



        logger.info('Success (PUT)/api/pvt/digital-queues');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                created: true,
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (PUT)/api/pvt/digital-queues');
        logger.info(error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                created: false,
                message: 'Internal server error'
            })
        };
    }
}


function validateReqId(value) {
    try {
        for (let i = 0; i < value.length; i++) {
            if (!value[i].match(DIGITAL_QUEUE_ID_REGEX)) {
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
