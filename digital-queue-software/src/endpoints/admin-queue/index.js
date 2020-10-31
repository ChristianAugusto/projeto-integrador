import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import {
    PUBLIC_PATH, SELECT_DIGITAL_QUEUES_QUERY_BUILDER
} from '@ServerConstants';
import fs from 'fs';


export default async function(req) {
    const queueId = req.params.queueId;

    try {
        logger.error(`Starting (GET)/admin/filas/${queueId}`);

        const queryResult = await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER('`name`,`isActive`,`isClosed`', `WHERE \`id\` = '${queueId}'`));

        logger.info(`Query result = ${JSON.stringify(queryResult)}`);


        if (queryResult[0].isClosed) {
            throw new Error('Queue is closed');
        }

        if (!queryResult[0].isActive) {
            throw new Error('Queue is not active');
        }


        const template = fs.readFileSync(`${PUBLIC_PATH}/templates/admin-queue.html`, {encoding: 'utf8'})
            .replace(/<server\.queueId ?\/?>/gm, queueId)
            .replace(/<server\.queueName ?\/?>/gm, queryResult[0].name);

        logger.error(`Ending (GET)/admin/filas/${queueId}`);

        return {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: template
        };
    }
    catch (error) {
        logger.error(`Error in (GET)/admin/filas/${queueId}`);
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
