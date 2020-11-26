import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    UPDATE_DIGITAL_QUEUE_QUERY_BUILDER
} from '@ServerConstants';



const allowedFields = [
    {
        name: 'isActive',
        type: 'boolean'
    }
];

const requiredFields = [
    'id'
];


export default async function(req) {
    try {
        logger.info('Starting (PATCH)/api/pvt/digital-queues');


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
                    updated: false,
                    message: 'Error in body fields, please check again'
                })
            };
        }

        const digitalQueueId = reqBody.id;


        const updateObj = {};

        const reqBodyEntries = Object.entries(reqBody);
        reqBodyEntries.forEach(function([key, value]) {
            const allowedField = allowedFields.filter(field => field.name === key);

            if (allowedField.length > 0) {
                if (allowedField[0].type === 'string') {
                    updateObj[key] = `'${value}'`;
                }
                else if (allowedField[0].type === 'boolean') {
                    updateObj[key] = `${value ? 1 : 0}`;
                }
            }
        });

        logger.info(`updateObj = ${JSON.stringify(updateObj)}`);


        const updateObjEntries = Object.entries(updateObj);

        if (updateObjEntries.length > 0) {
            const sets = updateObjEntries.reduce(function(acc, [key, value]) {
                acc.push(`SET \`${key}\` = ${value}`);

                return acc;
            }, []);

            const updateQuery = UPDATE_DIGITAL_QUEUE_QUERY_BUILDER(sets.join(','), `\`id\` = '${digitalQueueId}'`);

            logger.info(`updateQuery = ${updateQuery}`);

            await mysql(updateQuery);

            logger.info('Success (PATCH)/api/pvt/digital-queues');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    updated: true,
                    message: 'Success'
                })
            };
        }


        logger.info('Nothing to update (PATCH)/api/pvt/digital-queues');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                updated: false,
                message: 'Nothing to update'
            })
        };
    }
    catch (error) {
        logger.error('Error in (PATCH)/api/pvt/digital-queues');
        logger.info(error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                updated: false,
                message: 'Internal server error'
            })
        };
    }
}
