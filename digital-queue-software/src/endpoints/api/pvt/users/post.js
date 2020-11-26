import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    TRANSPORTS_LIMIT,
    SELECT_USERS_QUERY_BUILDER
} from '@ServerConstants';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';



export default async function(req) {
    try {
        logger.info('Starting (POST)/api/pvt/users');


        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (validateReqBodyFields(['id'], reqBody) && validateMysqlInteger(reqBody.id)) {
            logger.info('Success (POST)/api/pvt/users');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(SELECT_USERS_QUERY_BUILDER('*', `WHERE \`id\` = ${Number(reqBody.id)}`)),
                    message: 'Success'
                })
            };
        }

        if (validateReqBodyFields(['email'], reqBody)) {
            logger.info('Success (POST)/api/pvt/users');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: await mysql(SELECT_USERS_QUERY_BUILDER('*', `WHERE \`email\` = '${reqBody.email}'`)),
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


        logger.info('Success (POST)/api/pvt/users');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: await mysql(SELECT_USERS_QUERY_BUILDER('*', '', `LIMIT ${startIndex},${endIndex}`)),
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/pvt/users');
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
