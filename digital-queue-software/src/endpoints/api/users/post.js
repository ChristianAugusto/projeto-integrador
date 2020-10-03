import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerUtils/validate-required-fields';
import { TRANSPORTS_LIMIT } from '@ServerConstants';
import { validateMysqlInteger } from '@ServerUtils/validate-mysql-types';

import {
    selectUsersQuery,
    filterUserById,
    filterUserByEmail
} from './queries';



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
                    data: await mysql(`${filterUserById} = ${Number(reqBody.id)}`),
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
                    data: await mysql(`${filterUserByEmail} = '${reqBody.email}'`),
                    message: 'Success'
                })
            };
        }


        let startIndex = 0;
        if (validateMysqlInteger(reqBody.startIndex)) {
            startIndex = Number(reqBody.startIndex);
        }


        let endIndex = startIndex + TRANSPORTS_LIMIT();
        if (
            validateMysqlInteger(reqBody.endIndex) &&
            Number(reqBody.endIndex) - startIndex <= TRANSPORTS_LIMIT()
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
                data: await mysql(`${selectUsersQuery} ${startIndex},${endIndex}`),
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
