import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';

import { filterUserByEmail } from './queries';



export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (!reqBody || !reqBody.email || typeof(reqBody.email) != 'string') {
            logger.info('Incorrect API use');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    message: 'Incorrect API use'
                })
            };
        }


        logger.info('Success');

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
    catch (error) {
        logger.error('Error in (POST)/login');
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
