import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    DIGITAL_QUEUE_LIMIT,
    SELECT_DIGITAL_QUEUES_QUERY_BUILDER
} from '@ServerConstants';



export default async function(req, userAuthenticated) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (validateReqBodyFields(['id'], reqBody)) {
            let fields = '*';

            if (!userAuthenticated) {
                fields = '`day`,`start`,`end`,`userTimeMinutes`';
            }

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER(fields, `WHERE \`id\` = '${reqBody.id}'`)),
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


        logger.info('Success');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                results: (await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER('COUNT(*)')))[0]['COUNT(*)'],
                data: await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER('*', '', `LIMIT ${startIndex},${DIGITAL_QUEUE_LIMIT}`)),
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
                results: 0,
                data: null,
                message: 'Internal server error'
            })
        };
    }
}
