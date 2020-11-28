import moment from 'moment-timezone';

import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import processDigitalQueue from './methods/process-digital-queue';
import {
    SERVER_TIMEZONE,
    SELECT_DIGITAL_QUEUES_QUERY_BUILDER
} from '@ServerConstants';



export default async function(req) {
    try {
        logger.info('Starting (POST)/api/pvt/digital-queues/finish');


        const { body:reqBody } = req;

        logger.info(`reqBody = ${JSON.stringify(reqBody)}`);


        const finishQueues = async function() {
            try {
                const today = moment().tz(SERVER_TIMEZONE()).format('YYYY-MM-DD');

                const PAGE_SIZE = 20;
                let page = 0;

                // eslint-disable-next-line no-constant-condition
                while (true) {
                    const digitalQueues = await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER(
                        '`id`,`day`', 'WHERE isClosed = 0', `LIMIT ${page},${PAGE_SIZE}`
                    ));

                    logger.info(`digitalQueues.length = ${digitalQueues.length}`);

                    if (!digitalQueues.length || digitalQueues.length === 0) {
                        logger.info('No digital queues to process');
                        break;
                    }

                    for (let i = 0; i < digitalQueues.length; i++) {
                        await processDigitalQueue(digitalQueues[i], today);
                    }

                    page += PAGE_SIZE;
                }

                logger.info('Success in finishQueues');
            }
            catch (error) {
                logger.info('Error in finishQueues');
                logger.info(error);
            }
        };

        finishQueues();


        logger.info('Success (POST)/api/pvt/digital-queues/finish');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                message: 'Success'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/pvt/digital-queues/finish');
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
