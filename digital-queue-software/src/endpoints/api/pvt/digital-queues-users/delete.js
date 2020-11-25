import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import {
    DELETE_DIGITAL_QUEUE_USERS,
    DOCUMENTS_OPTIONS
} from '@ServerConstants';



export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        if (validateReqBodyFields(['digitalQueueId', 'document', 'documentType'], reqBody)) {
            const deleteDigitalQueueUserQuery = DELETE_DIGITAL_QUEUE_USERS(
                `\`digitalQueueId\` = '${reqBody.digitalQueueId}' 
                    AND \`document\` = '${reqBody.document.replace(DOCUMENTS_OPTIONS[reqBody.documentType].replaceRegex, '')}'
                    AND \`documentType\` = '${reqBody.documentType}'`
            );

            logger.info(`deleteDigitalQueueUserQuery = ${deleteDigitalQueueUserQuery}`);

            await mysql(deleteDigitalQueueUserQuery);


            logger.info('Success');

            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    deleted: true,
                    message: 'Success'
                })
            };
        }


        logger.info('No actions');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                deleted: false,
                message: 'No actions'
            })
        };
    }
    catch (error) {
        logger.error('Error in (DELETE)/api/pub/digital-queues-users');
        logger.info(error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                deleted: false,
                message: 'Internal server error'
            })
        };
    }
}
