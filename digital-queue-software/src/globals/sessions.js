import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import {
    SESSION_SECONDS_LIMIT, API_KEY, SELECT_USERS_QUERY_BUILDER, SESSION_COOKIE_NAME
} from '@ServerConstants';



const sessions = {};



function validateSession(sessionStr) {
    try {
        logger.info(`sessionStr = ${sessionStr}`);

        const session = JSON.parse(sessionStr);

        if (
            !sessions[session.id] || sessions[session.id].token != session.token ||
            !validateSessionTime(sessions[session.id].start)
        ) {
            return false;
        }

        logger.info(`sessions[session.id] = ${JSON.stringify(sessions[session.id])}`);

        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}

function validateSessionTime(startTime) {
    const sessionTimeSeconds = Math.round( (new Date() - startTime) / 1000 );

    logger.info(`sessionTimeSeconds = ${sessionTimeSeconds}`);

    return sessionTimeSeconds <= SESSION_SECONDS_LIMIT;
}

function validateApiKey(headerApiKeyValue) {
    try {
        logger.info(headerApiKeyValue);

        return API_KEY == headerApiKeyValue;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}


export function validateAdminSession(req) {
    if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
        return true;
    }

    return false;
}


export async function validateMasterSession(req) {
    try {
        const sessionStr = req.cookies[SESSION_COOKIE_NAME];

        if (!validateSession(sessionStr)) {
            return false;
        }

        const session = JSON.parse(sessionStr);

        const queryResult = await mysql(SELECT_USERS_QUERY_BUILDER('*', `WHERE \`id\` = ${Number(session.id)}`));

        if (queryResult[0].roleType != 'master') {
            return false;
        }

        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}

/*
    TODO (opcional): Criar função com processo paralelo
    para limpar dados de seções.
*/



export default sessions;
