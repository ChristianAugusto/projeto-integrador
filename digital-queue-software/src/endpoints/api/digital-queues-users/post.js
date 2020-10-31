import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    DIGITAL_QUEUES_USERS_LIMIT,
    SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER
} from '@ServerConstants';



export default async function(req, userAuthenticated) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (validateReqBodyFields(['digitalQueueId'], reqBody)) {
            let fields = '*';

            if (!userAuthenticated) {
                fields = '`name`,`appointment`,`attended`';
            }

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER(fields, `WHERE \`digitalQueueId\` = '${reqBody.digitalQueueId}'`)),
                    message: 'Success'
                })
            };
        }

        if (validateReqBodyFields(['document'], reqBody)) {
            let fields = '*';

            if (!userAuthenticated) {
                fields = '`name`';
            }

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER(fields, `WHERE \`document\` = '${reqBody.document}'`)),
                    message: 'Success'
                })
            };
        }

        if (!userAuthenticated) {
            return {
                status: 401,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    message: 'Insufficient permissions'
                })
            };
        }


        let startIndex = 0;
        if (validateMysqlInteger(reqBody.startIndex)) {
            startIndex = Number(reqBody.startIndex);
        }


        let endIndex = startIndex + DIGITAL_QUEUES_USERS_LIMIT;
        if (
            validateMysqlInteger(reqBody.endIndex) &&
            Number(reqBody.endIndex) - startIndex <= DIGITAL_QUEUES_USERS_LIMIT
        ) {
            endIndex = Number(reqBody.endIndex);
        }


        logger.info('Success');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: await mysql(SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER('*', '', `LIMIT ${startIndex},${endIndex}`)),
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/digital-queues');
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
