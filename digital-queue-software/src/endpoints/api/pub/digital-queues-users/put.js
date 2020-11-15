import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import hourStringToMinutes from '@ServerUtils/hour-string-to-minutes';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import validateDigitalQueue from '@ServerModules/validate-digital-queue';
import validateTransports from '@ServerModules/validate-transports';
import {
    SERVER_TIMEZONE,
    DATETIME_FORMAT_MYSQL,
    SELECT_DIGITAL_QUEUES_QUERY_BUILDER,
    SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER,
    INSERT_DIGITAL_QUEUE_USERS_QUERY,
    DOCUMENTS_OPTIONS
} from '@ServerConstants';



const requiredFields = [
    'digitalQueueId', 'document', 'name', 'email', 'telephone', 'documentType',
    'nationality', 'transportId', 'appointment'
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
                    created: false,
                    message: 'Error in body fields, please check again'
                })
            };
        }

        if (!(await validateDigitalQueue(reqBody.digitalQueueId))) {
            logger.info('Digital queue does not exist');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: 'Digital queue does not exist'
                })
            };
        }

        if (!(await validateTransports([reqBody.transportId]))) {
            logger.info('transport does not exist');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: 'transport does not exist'
                })
            };
        }

        if (!(await validateAppointment(reqBody))) {
            logger.info('Invalid appointment choice');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: 'Invalid appointment choice'
                })
            };
        }

        const insertQuery = `
            ${INSERT_DIGITAL_QUEUE_USERS_QUERY}
            VALUES (
                '${reqBody.digitalQueueId}',
                '${reqBody.document.replace(new RegExp(DOCUMENTS_OPTIONS[reqBody.documentType] || ''), '')}',
                '${reqBody.name}', '${reqBody.email}', '${reqBody.telephone}', '${reqBody.documentType}',
                '${reqBody.nationality}', '${moment().tz(SERVER_TIMEZONE()).format(DATETIME_FORMAT_MYSQL)}',
                ${reqBody.transportId}, '${reqBody.appointment}'
            )
        `;

        await mysql(insertQuery);

        logger.info('Success');

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
        logger.error('Error in (PUT)/api/pub/digital-queues-users');
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

async function validateAppointment(reqBody) {
    try {
        const digitalQueueResult = await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER('*', `WHERE \`id\` = '${reqBody.digitalQueueId}'`));

        const digitalQueue = digitalQueueResult[0];

        const appointmentInMinutes = hourStringToMinutes(reqBody.appointment);


        let validAppointment = false;

        for (
            let i = hourStringToMinutes(digitalQueue.start),
                limit = hourStringToMinutes(digitalQueue.end);
            i < limit; i += digitalQueue.userTimeMinutes
        ) {
            if (appointmentInMinutes == i) {
                validAppointment = true;
                break;
            }
        }

        if (!validAppointment) {
            return false;
        }


        const digitalQueueUsersResult = await mysql(SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER('*', `WHERE \`digitalQueueId\` = '${reqBody.digitalQueueId}' AND \`appointment\` = '${reqBody.appointment}'`));

        if (digitalQueueUsersResult.length > 0) {
            return false;
        }


        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}
