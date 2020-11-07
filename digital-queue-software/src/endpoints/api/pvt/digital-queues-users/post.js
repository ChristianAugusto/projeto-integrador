import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER
} from '@ServerConstants';



export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (validateReqBodyFields(['digitalQueueId', 'document', 'documentType'], reqBody)) {
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


        logger.info('No actions');

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
        logger.error('Error in (POST)/api/pub/digital-queues-users');
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
