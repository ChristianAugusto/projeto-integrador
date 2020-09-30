import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import {
    filterUserByEmail
} from './queries';


export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (reqBody.email && typeof(reqBody.email) == 'string') {
            try {
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
                return {
                    status: 500,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        data: null,
                        message: 'Error in get user(s)'
                    })
                };
            }
        }


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
