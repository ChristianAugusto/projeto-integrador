import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import {
    PUBLIC_PATH, SELECT_DIGITAL_QUEUES_QUERY_BUILDER
} from '@ServerConstants';
import fs from 'fs';


export default async function(req) {
    const digitalQueueId = req.params.digitalQueueId;

    try {
        logger.error(`Starting (GET)/admin/filas/${digitalQueueId}`);

        const queryResult = await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER(
            '`name`,`isActive`,`isClosed`,`day`', `WHERE \`id\` = '${digitalQueueId}'`
        ));

        logger.info(`Query result = ${JSON.stringify(queryResult)}`);


        if (queryResult.length === 0) {
            throw new Error('There is no queue for this id');
        }


        const digitalQueue = queryResult[0];

        if (digitalQueue.isClosed) {
            const csvPath = `${PUBLIC_PATH}/csvs/${digitalQueue.day}-${digitalQueueId}.csv`;

            return {
                status: 200,
                file: true,
                path: csvPath
            };
        }

        if (!digitalQueue.isActive) {
            throw new Error('Queue is not active');
        }


        const template = fs.readFileSync(`${PUBLIC_PATH}/templates/pvt-digital-queue.html`, {encoding: 'utf8'})
            .replace(/<server\.digitalQueueId ?\/?>/gm, digitalQueueId)
            .replace(/<server\.digitalQueueName ?\/?>/gm, digitalQueue.name);

        logger.error(`Ending (GET)/admin/filas/${digitalQueueId}`);

        return {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: template
        };
    }
    catch (error) {
        logger.error(`Error in (GET)/admin/filas/${digitalQueueId}`);
        logger.info(error);

        return {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: '<h1>Not found template</h1>'
            /*
                TODO: Not found template
            */
        };
    }
}
