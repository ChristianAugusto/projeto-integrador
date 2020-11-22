import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    DELETE_DIGITAL_QUEUE_QUERY,
    DELETE_DIGITAL_QUEUE_TRANSPORTS,
    DELETE_DIGITAL_QUEUE_USERS
} from '@ServerConstants';



const requiredFields = [
    'id'
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
                    deleted: false,
                    message: 'Error in body fields, please check again'
                })
            };
        }

        const digitalQueueId = reqBody.id;


        const deleteDigitalQueueUsersQuery = DELETE_DIGITAL_QUEUE_USERS(`\`digitalQueueId\` = '${digitalQueueId}'`);

        logger.info(`deleteDigitalQueueUsersQuery = ${deleteDigitalQueueUsersQuery}`);

        await mysql(deleteDigitalQueueUsersQuery);


        const deleteDigitalQueueTransportsQuery = DELETE_DIGITAL_QUEUE_TRANSPORTS(`\`digitalQueueId\` = '${digitalQueueId}'`);

        logger.info(`deleteDigitalQueueTransportsQuery = ${deleteDigitalQueueTransportsQuery}`);

        await mysql(deleteDigitalQueueTransportsQuery);


        const deleteDigitalQueueQuery = DELETE_DIGITAL_QUEUE_QUERY(`\`id\` = '${digitalQueueId}'`);

        logger.info(`deleteDigitalQueueQuery = ${deleteDigitalQueueQuery}`);

        await mysql(deleteDigitalQueueQuery);



        logger.info('Success');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                deleted: true,
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (DELETE)/api/digital-queues');
        logger.info(error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                deleted: false,
                message: 'Internal server error'
            })
        };
    }
}
