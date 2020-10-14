import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerUtils/validate-required-fields';
import {
    TRANSPORTS_LIMIT,
    SELECT_USERS_QUERY,
    FILTER_USER_BY_ID_QUERY,
    FILTER_USER_BY_EMAIL_QUERY
} from '@ServerConstants';
import { validateMysqlInteger } from '@ServerUtils/validate-mysql-types';



export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (validateReqBodyFields(['id'], reqBody) && validateMysqlInteger(reqBody.id)) {
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(`${FILTER_USER_BY_ID_QUERY} = ${Number(reqBody.id)}`),
                    message: 'Success'
                })
            };
        }

        if (validateReqBodyFields(['email'], reqBody)) {
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(`${FILTER_USER_BY_EMAIL_QUERY} = '${reqBody.email}'`),
                    message: 'Success'
                })
            };
        }


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
                data: await mysql(`${SELECT_USERS_QUERY} ${startIndex},${endIndex}`),
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/users');
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
