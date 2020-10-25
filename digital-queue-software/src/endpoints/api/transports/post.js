import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import {
    TRANSPORTS_LIMIT,
    SELECT_TRANSPORT_QUERY
} from '@ServerConstants';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';



export default async function(req) {
    try {
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


        logger.info('Success');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: await mysql(`${SELECT_TRANSPORT_QUERY} ${startIndex},${endIndex}`),
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/transports');
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
