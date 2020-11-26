import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    DELETE_DIGITAL_QUEUE_USERS
} from '@ServerConstants';



export default async function(req) {
    try {
        logger.info('Starting (DELETE)/api/pvt/digital-queues-users');


        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (validateReqBodyFields(['digitalQueueId', 'appointment'], reqBody)) {
            const deleteDigitalQueueUserQuery = DELETE_DIGITAL_QUEUE_USERS(
                `\`digitalQueueId\` = '${reqBody.digitalQueueId}' 
                    AND \`appointment\` = '${reqBody.appointment}'`
            );

            logger.info(`deleteDigitalQueueUserQuery = ${deleteDigitalQueueUserQuery}`);

            await mysql(deleteDigitalQueueUserQuery);


            logger.info('Success (DELETE)/api/pvt/digital-queues-users');

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


        logger.info('No actions (DELETE)/api/pvt/digital-queues-users');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                deleted: false,
                message: 'No actions'
            })
        };
    }
    catch (error) {
        logger.error('Error in (DELETE)/api/pvt/digital-queues-users');
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
