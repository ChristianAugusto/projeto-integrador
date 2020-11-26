import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER
} from '@ServerConstants';



export default async function(req) {
    try {
        logger.info('Starting (POST)/api/pvt/digital-queues-users');


        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (validateReqBodyFields(['digitalQueueId', 'document', 'documentType'], reqBody)) {
            logger.info('Success (POST)/api/pvt/digital-queues-users');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER('`name`', `WHERE \`document\` = '${reqBody.document}' AND \`documentType\` = '${reqBody.documentType}' AND \`digitalQueueId\` = '${reqBody.digitalQueueId}'`)),
                    message: 'Success'
                })
            };
        }

        if (validateReqBodyFields(['digitalQueueId'], reqBody)) {
            logger.info('Success (POST)/api/pvt/digital-queues-users');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER('`name`', `WHERE \`digitalQueueId\` = '${reqBody.digitalQueueId}'`)),
                    message: 'Success'
                })
            };
        }


        logger.info('No actions (POST)/api/pvt/digital-queues-users');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                message: 'No actions'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/pvt/digital-queues-users');
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
