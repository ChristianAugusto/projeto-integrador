import logger from '@ServerUtils/logger';
import mysql from '@ServerHandlers/mysql';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';
import {
    FILTER_TRANSPORT_BY_ID_QUERY
} from '@ServerConstants';



export default async function(transportsIds) {
    try {
        if (!Array.isArray(transportsIds)) {
            return false;
        }

        for (let i = 0; i < transportsIds.length; i++) {
            if (!validateMysqlInteger(transportsIds[i])) {
                return false;
            }

            const queryResult = await mysql(`${FILTER_TRANSPORT_BY_ID_QUERY} = ${transportsIds[i]}`);

            if (queryResult.length === 0) {
                return false;
            }
        }

        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}