/* ROUTES */
export const HOME_ROUTE = '/';
export const ADMIN_ROUTE = '/admin';
export const ADMIN_LOGIN_ROUTE = '/admin/login';
export const DIGITAL_QUEUES_API = '/api/digital-queues';
export const DIGITAL_QUEUES_USERS_API = '/api/digital-queues-users';
export const DIGITAL_QUEUES_TRANSPORTS_API = '/api/digital-queues-transports';


/* SESSION */
export const SESSION_COOKIE_NAME = 'digital-queue-software';
// export const SESSION_SECONDS_LIMIT = 10 * 1000; // 10 seconds
export const SESSION_SECONDS_LIMIT = 120 * 60 * 1000; // 2 hours


/* JS MESSAGES */
export const SERVER_ERROR_MESSAGE = 'Erro interno, tente novamente mais tarde';
export function DIGITAL_QUEUES_USER_SUCCESS(appointment) {
    return `Seu registro foi inserido com sucesso, seu atentimento será às ${appointment}`;
}


export const DIGITAL_QUEUE_LIMIT = 20;
export const DOCUMENT_REGEX = /[^a-zA-Z0-9]/gm;
export const DIGITAL_QUEUE_USER_FORM_COOKIE_NAME = 'digital-queue-user-form';
