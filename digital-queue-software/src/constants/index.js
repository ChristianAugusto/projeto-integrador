import path from 'path';


export const SERVER_PORT = 3000;

export const PUBLIC_PATH = path.resolve(__dirname, '..', '..', 'public');

export const STATIC_PATH = path.resolve(__dirname, '..', '..', 'public/files');

export function MYSQL_HOST() {
    if (process.env.environment && process.env.environment == 'prod') {
        return 'digital-queue-mysql'; // docker-compose host
    }
    else {
        return 'localhost'; // dev environment host
    }
}

export function MYSQL_PORT() {
    if (process.env.environment && process.env.environment == 'prod') {
        return 3306; // docker-compose mysql port
    }
    else {
        return 5500; // dev environment mysql port
    }
}

export const MYSQL_USER = 'root';

export const MYSQL_DATABASE = 'digital-queue-software';

export function MYSQL_PASSWORD() {
    if (process.env.environment && process.env.environment == 'prod') {
        return 'y437qpkq8wyle88m'; // docker-compose mysql root password
    }
    else {
        return 'y437qpkq8wyle88m'; // dev environment mysql root password
    }
}

export const DATETIME_FORMAT_MYSQL = 'YYYY-MM-DD HH:mm:ss';

export const SESSION_COOKIE_NAME = 'digital-queue-software';

// export const SESSION_SECONDS_LIMIT = 10;
export const SESSION_SECONDS_LIMIT = 60 * 60 * 2; // 2 hours

export const API_KEY = 'mey9ht1t5wklvt9pyresetbfwy1nc7cj';

export const DIGITAL_QUEUE_LIMIT = 20;

export const DIGITAL_QUEUE_ID_REGEX = /[a-z0-9-]/;

export const TRANSPORTS_LIMIT = 20;

export const DIGITAL_QUEUES_USERS_LIMIT = 20;

export const SELECT_DIGITAL_QUEUES_QUERY = 'SELECT * FROM `digital_queues` LIMIT';

export const FILTER_DIGITAL_QUEUE_BY_ID_QUERY = 'SELECT `id` FROM `digital_queues` WHERE `id`';

export const INSERT_DIGITAL_QUEUE_QUERY = 'INSERT INTO `digital_queues` (`id`, `name`, `creation`, `isActive`, `start`, `end`, `userTimeMinutes`)';

export const INSERT_DIGITAL_QUEUE_TRANSPORTS_QUERY = 'INSERT INTO `digital_queues_transports` (`digitalQueueId`, `transportId`)';

export const FILTER_TRANSPORT_BY_ID_QUERY = 'SELECT * FROM `transports` WHERE `id`';

export const INSERT_TRANSPORT_QUERY = 'INSERT INTO `transports` (`name`)';

export const SELECT_USERS_QUERY = 'SELECT * FROM `users` LIMIT';

export const FILTER_USER_BY_ID_QUERY = 'SELECT `id` FROM `users` WHERE `id`';

export const FILTER_USER_BY_EMAIL_QUERY = 'SELECT `email` FROM `users` WHERE `email`';

export const INSERT_USER_QUERY_QUERY = 'INSERT INTO `users` (`name`, `email`, `password`, `telephone`, `document`, `documentType`, `nationality`, `register`, `roleType`)';

export const SELECT_DIGITAL_QUEUES_USERS_QUERY = 'SELECT * FROM `digital_queues_users` LIMIT';

export const SELECT_TRANSPORT_QUERY = 'SELECT * FROM `transports` LIMIT';



/*
    TODO (opcional): Pegar valor de uma possível configuração do cliente
*/

export function SERVER_TIMEZONE() {
    return 'America/Sao_Paulo';
}

export function SECRET_KEY() {
    return 'wksswszvdsmdgjl3';
}
