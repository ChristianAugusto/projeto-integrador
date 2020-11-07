import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    SELECT_DIGITAL_QUEUES_QUERY_BUILDER,
    SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER,
    SELECT_DIGITAL_QUEUES_TRANSPORTS_QUERY_BUILDER
} from '@ServerConstants';



export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (!validateReqBodyFields(['digitalQueueId'], reqBody)) {
            logger.info('Invalid digitalQueueId');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    message: 'Invalid digitalQueueId'
                })
            };
        }

        const digitalQueueQueryResult = await mysql(
            SELECT_DIGITAL_QUEUES_QUERY_BUILDER('`name`,`day`,`start`,`end`,`userTimeMinutes`', `WHERE \`id\` = '${reqBody.digitalQueueId}'`)
        );

        const digitalQueueUsersQueryResult = await mysql(
            SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER('`name`,`appointment`,`attended`', `WHERE \`digitalQueueId\` = '${reqBody.digitalQueueId}'`)
        );

        const digitalQueueTransportsQueryResult = await mysql(
            SELECT_DIGITAL_QUEUES_TRANSPORTS_QUERY_BUILDER(reqBody.digitalQueueId)
        );


        const data = {
            id: reqBody.digitalQueueId,
            ...digitalQueueQueryResult[0],
            users: digitalQueueUsersQueryResult,
            transports: digitalQueueTransportsQueryResult
        };


        logger.info('Success');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data,
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/pub/digital-queue-page');
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
