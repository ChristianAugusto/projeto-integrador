import mysql from '@ServerHandlers/mysql';
import logger from '@ServerUtils/logger';
import {
    PUBLIC_PATH, SELECT_USERS_QUERY_BUILDER, SESSION_COOKIE_NAME
} from '@ServerConstants';
import fs from 'fs';


export default async function(req) {
    try {
        logger.error('Starting (GET)/admin');

        const session = JSON.parse(req.cookies[SESSION_COOKIE_NAME]);

        const queryResult = await mysql(SELECT_USERS_QUERY_BUILDER('`name`', `WHERE \`id\` = '${session.id}'`));


        const template = fs.readFileSync(`${PUBLIC_PATH}/templates/pvt-admin.html`, {encoding: 'utf8'})
            .replace(/<server\.userName ?\/?>/gm, queryResult[0].name);

        logger.error('Ending (GET)/admin');

        return {
            status: 200,
            headers: {
                'Content-Type': 'text/html'
            },
            body: template
        };
    }
    catch (error) {
        logger.error('Error in (GET)/admin');
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
