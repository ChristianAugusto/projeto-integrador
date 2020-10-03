import logger from '@ServerUtils/logger';
import {
    SESSION_SECONDS_LIMIT, API_KEY
} from '@ServerConstants';



const sessions = {};



export function validateSession(sessionStr) {
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

    return sessionTimeSeconds <= SESSION_COOKIE_NAME;
}

export function validateApiKey(headerApiKeyValue) {
    try {
        logger.info(headerApiKeyValue);

        return API_KEY == headerApiKeyValue;
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
