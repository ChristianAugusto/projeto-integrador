import logger from '@ServerUtils/logger';
import mysql from '@ServerHandlers/mysql';
import {
    FILTER_DIGITAL_QUEUE_BY_ID_QUERY
} from '@ServerConstants';



export default async function (digitalQueueId) {
    try {
        const queryResult = await mysql(`${FILTER_DIGITAL_QUEUE_BY_ID_QUERY} = ${digitalQueueId}`);

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
