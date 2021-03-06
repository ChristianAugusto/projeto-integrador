import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    DIGITAL_QUEUE_LIMIT,
    SELECT_DIGITAL_QUEUES_QUERY_BUILDER
} from '@ServerConstants';



export default async function(req) {
    try {
        logger.info('Starting (POST)/api/pvt/digital-queues');


        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (validateReqBodyFields(['id'], reqBody)) {
            logger.info('Success (POST)/api/pvt/digital-queues');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER('*', `WHERE \`id\` = '${reqBody.id}'`)),
                    message: 'Success'
                })
            };
        }


        let startIndex = 0;
        if (validateMysqlInteger(reqBody.startIndex)) {
            startIndex = Number(reqBody.startIndex);
        }


        logger.info('Success (POST)/api/pvt/digital-queues');

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
        logger.error('Error in (POST)/api/pvt/digital-queues');
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
