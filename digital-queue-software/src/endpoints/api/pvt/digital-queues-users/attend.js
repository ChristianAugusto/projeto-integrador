import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    UPDATE_DIGITAL_QUEUE_USER_QUERY_BUILDER
} from '@ServerConstants';



export default async function(req) {
    try {
        logger.info('Starting (PATCH)/api/pvt/digital-queues-users/attend');


        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (!validateReqBodyFields(['digitalQueueId', 'appointment', 'attended'], reqBody)) {
            logger.info('Error in body fields, please check again');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    updated: false,
                    message: 'Error in body fields, please check again'
                })
            };
        }

        const updateQuery = UPDATE_DIGITAL_QUEUE_USER_QUERY_BUILDER(
            `SET \`attended\` = ${reqBody.attended ? 1 : 0}`,
            `\`digitalQueueId\` = '${reqBody.digitalQueueId}' AND \`appointment\` = '${reqBody.appointment}'`
        );

        logger.info(`updateQuery = ${updateQuery}`);

        await mysql(updateQuery);


        logger.info('Success (PATCH)/api/pvt/digital-queues-users/attend');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                updated: true,
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (PATCH)/api/pvt/digital-queues-users/attend');
        logger.info(error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                updated: false,
                message: 'Internal server error'
            })
        };
    }
}
