import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import {
    PUBLIC_PATH, SELECT_DIGITAL_QUEUES_QUERY_BUILDER
} from '@ServerConstants';
import fs from 'fs';


export default async function(req) {
    const queueId = req.params.queueId;

    try {
        logger.error(`Starting (GET)/queue/${queueId}`);

        const queryResult = await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER('`name`,`isActive`', `WHERE \`id\` = '${queueId}'`));

        logger.info(`Query result = ${JSON.stringify(queryResult)}`);

        if (!queryResult[0].isActive) {
            throw new Error('Queue is not active');
        }

        /*
            TODO: Validar fila finalizada
        */

        const template = fs.readFileSync(`${PUBLIC_PATH}/templates/queue.html`, {encoding: 'utf8'})
            .replace(/<server\.queueId ?\/?>/gm, queueId)
            .replace(/<server\.queueName ?\/?>/gm, queryResult[0].name);

        logger.error(`Ending (GET)/queue/${queueId}`);

        return {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: template
        };
    }
    catch (error) {
        logger.error(`Error in (GET)/queue/${queueId}`);
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
