import logger from '@ServerUtils/logger';
import mysql from '@ServerHandlers/mysql';
import { validateMysqlInteger } from '@ServerModules/validate-mysql-types';
import {
    SELECT_TRANSPORTS_QUERY_BUILDER
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

            const queryResult = await mysql(SELECT_TRANSPORTS_QUERY_BUILDER('*', `WHERE \`id\` = ${transportsIds[i]}`));

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