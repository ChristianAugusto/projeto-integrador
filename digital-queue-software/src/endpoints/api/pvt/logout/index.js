import logger from '@ServerUtils/logger';
import { logout } from '@ServerGlobals/sessions';



export default async function(req) {
    try {
        logger.info('Starting (POST)/api/pub/login');


        if (!logout(req)) {
            logger.info('Error (POST)/api/pvt/logout');

            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    data: null,
                    message: 'Logout failed'
                })
            };
        }


        logger.info('Success (POST)/api/pub/login');

        return {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                message: 'Sucesso'
            })
        };
    }
    catch (error) {
        logger.error('Error in (POST)/api/pub/login');
        logger.info(error);

        return {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: null,
                message: 'Internal server error'
            })
        };
    }
}
