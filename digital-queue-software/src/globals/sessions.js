import logger from '@ServerUtils/logger';
import {
    SESSION_SECONDS_LIMIT, API_KEY, SESSION_COOKIE_NAME
} from '@ServerConstants';



const sessions = {};


function validateSessionTime(startTime) {
    const sessionTimeSeconds = Math.round( (new Date() - startTime) / 1000 );

    logger.info(`sessionTimeSeconds = ${sessionTimeSeconds}`);

    return sessionTimeSeconds <= SESSION_SECONDS_LIMIT;
}


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


function validateApiKey(headerApiKeyValue) {
    try {
        logger.info(headerApiKeyValue);

        return API_KEY === headerApiKeyValue;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}


export function validateAdminPage(req) {
    if (validateSession(req.cookies[SESSION_COOKIE_NAME])) {
        return true;
    }

    return false;
}


export function validateAdminApi(req) {
    if (validateApiKey(req.header('API-KEY')) || validateSession(req.cookies[SESSION_COOKIE_NAME])) {
        return true;
    }

    return false;
}


export function validateMasterApi(req) {
    try {
        if (validateApiKey(req.header('API-KEY'))) {
            return true;
        }


        const sessionStr = req.cookies[SESSION_COOKIE_NAME];

        if (!validateSession(sessionStr)) {
            return false;
        }

        const session = JSON.parse(sessionStr);

        const serverSession = sessions[session.id];

        if (serverSession.roleType != 'master') {
            return false;
        }

        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}


export function validateMasterPage(req) {
    try {
        const sessionStr = req.cookies[SESSION_COOKIE_NAME];

        if (!validateSession(sessionStr)) {
            return false;
        }

        const session = JSON.parse(sessionStr);

        const serverSession = sessions[session.id];

        if (serverSession.roleType != 'master') {
            return false;
        }

        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}


export function logout(req) {
    try {
        const sessionStr = req.cookies[SESSION_COOKIE_NAME];

        if (!validateSession(sessionStr)) {
            return false;
        }

        const session = JSON.parse(sessionStr);

        delete sessions[session.id];

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
