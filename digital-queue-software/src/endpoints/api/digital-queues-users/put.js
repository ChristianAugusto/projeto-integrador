import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerUtils/validate-required-fields';
import { validateMysqlInteger } from '@ServerUtils/validate-mysql-types';
import {
    FILTER_DIGITAL_QUEUE_BY_ID_QUERY
} from '@ServerConstants';



const requiredFields = [
    'digitalQueueId', 'document', 'name', 'email', 'password', 'telephone',
    'documentType', 'nationality', 'register', 'transportId', 'appointment',
    'attended'
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

        if (!validateDigitalQueue(reqBody.digitalQueueId)) {
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
        logger.error('Error in (PUT)/api/digital-queues-users');
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

async function validateDigitalQueue(digitalQueueId) {
    try {
        const queryResult = await mysql(`${FILTER_DIGITAL_QUEUE_BY_ID_QUERY} = ${digitalQueueId}`);

        if (queryResult.length === 0) {
            return false;
        }

        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}
