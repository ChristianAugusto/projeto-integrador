import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import {
    TRANSPORTS_LIMIT,
    SELECT_TRANSPORTS_QUERY_BUILDER
} from '@ServerConstants';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';



export default async function(req) {
    try {
        logger.info('Starting (POST)/api/pvt/transports');


        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        let startIndex = 0;
        if (validateMysqlInteger(reqBody.startIndex)) {
            startIndex = Number(reqBody.startIndex);
        }


        let endIndex = startIndex + TRANSPORTS_LIMIT;
        if (
            validateMysqlInteger(reqBody.endIndex) &&
            Number(reqBody.endIndex) - startIndex <= TRANSPORTS_LIMIT
        ) {
            endIndex = Number(reqBody.endIndex);
        }


        logger.info('Success (POST)/api/pvt/transports');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                results: (await mysql(SELECT_TRANSPORTS_QUERY_BUILDER('COUNT(*)')))[0]['COUNT(*)'],
                data: await mysql(SELECT_TRANSPORTS_QUERY_BUILDER('*', '', `LIMIT ${startIndex},${endIndex}`)),
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/pvt/transports');
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
