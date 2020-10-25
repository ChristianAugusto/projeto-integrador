import logger from '@ServerUtils/logger';
import mysql from '@ServerHandlers/mysql';
import {
    SELECT_DIGITAL_QUEUES_QUERY_BUILDER
} from '@ServerConstants';



export default async function (digitalQueueId) {
    try {
        const queryResult = await mysql(SELECT_DIGITAL_QUEUES_QUERY_BUILDER('`id`', `WHERE \`id\` = '${digitalQueueId}'`));

        if (queryResult.length === 0) {
            return false;
        }

        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}
