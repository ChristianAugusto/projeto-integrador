import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import validateReqBodyFields from '@ServerModules/validate-required-fields';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';
import validateDigitalQueue from '@ServerModules/validate-digital-queue';
import validateTransports from '@ServerModules/validate-transports';



const requiredFields = [
    'digitalQueueId', 'document', 'name', 'email', 'telephone', 'documentType',
    'nationality', 'register', 'transportId', 'appointment', 'attended'
];


export default async function(req) {
    try {
        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);

        // if (!validateReqBodyFields(requiredFields, reqBody)) {
        //     logger.info('Error in body fields, please check again');

        //     return {
        //         status: 400,
        //         headers: {
        //             'Content-Type': 'application/json'
        //         },
        //         body: JSON.stringify({
        //             data: null,
        //             created: false,
        //             message: 'Error in body fields, please check again'
        //         })
        //     };
        // }

        if (!validateDigitalQueue(reqBody.digitalQueueId)) {
            logger.info('Digital queue does not exist');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: 'Digital queue does not exist'
                })
            };
        }

        if (!(await validateTransports([reqBody.transportId]))) {
            logger.info('transport does not exist');

            return {
                status: 400,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    created: false,
                    message: 'transport does not exist'
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
                data: null,
                created: true,
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (PUT)/api/digital-queues-users');
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
