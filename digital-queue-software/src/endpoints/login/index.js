import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import sessions from '@ServerGlobals/sessions';
import generateHash from '@ServerUtils/generate-hash';
import { filterUserByEmail } from './queries';
import {
    SERVER_TIMEZONE, 
    DATETIME_FORMAT_MYSQL
} from '@ServerConstants';



const requiredFields = ['email', 'password'];


export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (!validateReqBodyFields(reqBody)) {
            logger.info('Error in body fields, please check again');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    message: 'Error in body fields, please check again'
                })
            };
        }


        const usersObtained = await mysql(`${filterUserByEmail} = '${reqBody.email}'`);

        if (!Array.isArray(usersObtained) || usersObtained.length == 0) {
            logger.info('Usuário não existente');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    message: 'Usuário não existente'
                })
            };
        }


        const user = usersObtained[0];


        const generatedHash = generateHash(reqBody.password);

        logger.info(`generatedHash = ${generatedHash}`);
        logger.info(`user.password = ${user.password}`);


        if (!reqBody.password || generateHash(reqBody.password) != user.password) {
            logger.info('Senha errada');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    message: 'Senha errada'
                })
            };
        }

        const actualMoment = moment().tz(SERVER_TIMEZONE()).format(DATETIME_FORMAT_MYSQL());


        const sessionToken = generateHash(`${user.id}|${actualMoment}`);


        sessions[`${user.id}`] = {
            token: sessionToken,
            start: new Date()
        };


        logger.info(`sessionToken = ${sessionToken}`);

        logger.info('Success');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: {
                    id: `${user.id}`,
                    token: sessionToken
                },
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

function validateReqBodyFields(reqBody) {
    const reqBodyFields = Object.keys(reqBody);

    for (let i = 0; i < requiredFields.length; i++) {
        if (reqBodyFields.indexOf(requiredFields[i]) == -1) {
            return false;
        }
    }

    return true;
}