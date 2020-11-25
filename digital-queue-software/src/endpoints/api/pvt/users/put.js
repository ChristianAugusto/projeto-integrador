import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import generateHash from '@ServerUtils/generate-hash';
import {
    SERVER_TIMEZONE, 
    DATETIME_FORMAT_MYSQL,
    INSERT_USER_QUERY_QUERY,
    DOCUMENTS_OPTIONS,
    PASSWORD_MIN_SIZE,
    PASSWORD_MAX_SIZE
} from '@ServerConstants';



const requiredFields = [
    'name', 'email', 'password', 'telephone',
    'document', 'documentType', 'nationality'
];


export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);

        if (!validateReqBodyFields(requiredFields, reqBody)) {
            logger.info('Error in body fields, please check again');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: 'Error in body fields, please check again'
                })
            };
        }


        if (reqBody.password.length < PASSWORD_MIN_SIZE || reqBody.password.length > PASSWORD_MAX_SIZE) {
            logger.info(`Password size needs to be beetween ${PASSWORD_MIN_SIZE} and ${PASSWORD_MAX_SIZE}`);

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: `Password size needs to be beetween ${PASSWORD_MIN_SIZE} and ${PASSWORD_MAX_SIZE}`
                })
            };
        }


        const query = `
            ${INSERT_USER_QUERY_QUERY}
            VALUES (
                '${reqBody.name}', '${reqBody.email}', '${generateHash(reqBody.password)}',
                '${reqBody.telephone}',
                '${reqBody.document.replace(DOCUMENTS_OPTIONS[reqBody.documentType].replaceRegex, '')}',
                '${reqBody.documentType}',
                '${reqBody.nationality}', '${moment().tz(SERVER_TIMEZONE()).format(DATETIME_FORMAT_MYSQL)}',
                '${reqBody.roleType}'
            )
        `;


        await mysql(query);


        logger.info('Success');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                created: true,
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (PUT)/api/pvt/users');
        logger.info(error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                created: false,
                message: 'Internal server error'
            })
        };
    }
}
