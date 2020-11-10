export const ROUTES = {
    pages: {
        pub: {
            home: '/',
            login: '/admin/login'
        },
        pvt: {
            admin: '/admin'
        }
    },
    api: {
        pub: {
            digitalQueuesUsers: '/api/pub/digital-queues-users',
            digitalQueuePage: '/api/pub/digital-queue-page',
            login: '/api/pub/login'
        },
        pvt: {
            digitalQueues: '/api/pvt/digital-queues',
            transports: '/api/pvt/transports'
        }
    }
};


/* SESSION */
export const SESSION_COOKIE_NAME = 'digital-queue-software';
// export const SESSION_SECONDS_LIMIT = 10 * 1000; // 10 seconds
export const SESSION_SECONDS_LIMIT = 120 * 60 * 1000; // 2 hours


/* JS MESSAGES */
export const SERVER_ERROR_MESSAGE = 'Erro interno, tente novamente mais tarde';
export function DIGITAL_QUEUES_USER_SUCCESS(appointment) {
    return `Seu registro foi inserido com sucesso, seu atentimento será às ${appointment}`;
}


export const TRANSPORTS_LIMIT = 20;
export const DIGITAL_QUEUE_LIMIT = 20;
export const DOCUMENT_REGEX = /[^a-zA-Z0-9]/gm;
export const DIGITAL_QUEUE_USER_FORM_COOKIE_NAME = 'digital-queue-user-form';
export const INPUT_DATE_MASK = 'YYYY-MM-DD';


/*
    TODO (opcional): Pegar valor de uma possível configuração do cliente
*/

export function SERVER_TIMEZONE() {
    return 'America/Sao_Paulo';
}
