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
        return 3306; // dev environment mysql port
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

export const HEADER_API_KEY = 'api-key';

// export const SESSION_SECONDS_LIMIT = 10;
export const SESSION_SECONDS_LIMIT = 60 * 60 * 2; // 2 hours

export const API_KEY = 'mey9ht1t5wklvt9pyresetbfwy1nc7cj';

export const DIGITAL_QUEUE_ID_REGEX = /[a-z0-9-]/;

export const DIGITAL_QUEUE_LIMIT = 20;

export const TRANSPORTS_LIMIT = 20;

export const DIGITAL_QUEUES_USERS_LIMIT = 20;

export function SELECT_DIGITAL_QUEUES_QUERY_BUILDER(fields='*', conditions='', limit='') {
    return `SELECT ${fields} FROM \`digital_queues\` ${conditions} ${limit}`.trim();
}

export function SELECT_DIGITAL_QUEUES_USERS_QUERY_BUILDER(fields='*', conditions='', limit='') {
    return `SELECT ${fields} FROM \`digital_queues_users\` ${conditions} ${limit}`.trim();
}

export function SELECT_DIGITAL_QUEUES_TRANSPORTS_QUERY_BUILDER(digitalQueueId) {
    /*
        This query get the transports name from a digital queue filtering by digital queue id
        and the queue needs to be active and not closed.
    */

    return `
        SELECT
            \`trans\`.\`id\`,
            \`trans\`.\`name\`
        FROM
            \`transports\` AS \`trans\`,
            \`digital_queues_transports\` AS \`dqt\`,
            \`digital_queues\` AS \`dq\`
        WHERE
            \`dqt\`.\`digitalQueueId\` = '${digitalQueueId}'
                AND \`dq\`.\`id\` = '${digitalQueueId}'
                AND \`trans\`.\`id\` = \`dqt\`.\`transportId\`
                AND \`dq\`.\`isActive\` = 1
                AND \`dq\`.\`isClosed\` = 0;
    `;
}

export function SELECT_TRANSPORTS_QUERY_BUILDER(fields='*', conditions='', limit='') {
    return `SELECT ${fields} FROM \`transports\` ${conditions} ${limit}`.trim();
}

export function SELECT_USERS_QUERY_BUILDER(fields='*', conditions='', limit='') {
    return `SELECT ${fields} FROM \`users\` ${conditions} ${limit}`.trim();
}

export const INSERT_DIGITAL_QUEUE_QUERY = 'INSERT INTO `digital_queues` (`id`, `name`, `creation`, `isActive`, `isClosed`, `day`, `start`, `end`, `userTimeMinutes`)';

export const INSERT_DIGITAL_QUEUE_USERS_QUERY = 'INSERT INTO `digital_queues_users` (`digitalQueueId`, `document`, `name`, `email`, `telephone`, `documentType`, `nationality`, `register`, `transportId`, `appointment`)';

export const INSERT_DIGITAL_QUEUE_TRANSPORTS_QUERY = 'INSERT INTO `digital_queues_transports` (`digitalQueueId`, `transportId`)';

export const INSERT_TRANSPORT_QUERY = 'INSERT INTO `transports` (`name`)';

export const INSERT_USER_QUERY_QUERY = 'INSERT INTO `users` (`name`, `email`, `password`, `telephone`, `document`, `documentType`, `nationality`, `register`, `roleType`)';

export function UPDATE_DIGITAL_QUEUE_QUERY_BUILDER(sets, conditions) {
    return `UPDATE \`digital_queues\` ${sets} WHERE ${conditions}`;
}

export function DELETE_DIGITAL_QUEUE_QUERY(conditions) {
    return `DELETE FROM \`digital_queues\` WHERE ${conditions}`;
}

export function DELETE_DIGITAL_QUEUE_TRANSPORTS(conditions) {
    return `DELETE FROM \`digital_queues_transports\` WHERE ${conditions}`;
}

export function DELETE_DIGITAL_QUEUE_USERS(conditions) {
    return `DELETE FROM \`digital_queues_users\` WHERE ${conditions}`;
}

export const PASSWORD_MIN_SIZE = 8;

export const PASSWORD_MAX_SIZE = 16;

export const DOCUMENTS_OPTIONS = {
    '': {
        mask:'',
        replaceRegex: '\\D'
    },
    'cpf': {
        mask:'000.000.000-00',
        replaceRegex: '\\D'
    },
    'rg': {
        mask:'00.000.000-0',
        replaceRegex: '\\D'
    },
    'birth-document': {
        mask:'',
        replaceRegex: '\\D'
    }
};



/*
    TODO (opcional): Pegar valor de uma possível configuração do cliente
*/

export function SERVER_TIMEZONE() {
    return 'America/Sao_Paulo';
}

export function SECRET_KEY() {
    return 'wksswszvdsmdgjl3';
}
