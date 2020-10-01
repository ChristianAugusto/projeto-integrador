import path from 'path';



export function serverPORT() {
    return 3000;
}

export function publicPATH() {
    return path.resolve(__dirname, '..', '..', 'public');
}

export function staticPATH() {
    return path.resolve(__dirname, '..', '..', 'public/files');
}

export function MYSQL_HOST() {
    return 'localhost'; // TODO: Ajustar host em prod
}

export function MYSQL_PORT() {
    return 3306;
}

export function MYSQL_USER() {
    return 'root';
}

export function MYSQL_DATABASE() {
    return 'digital-queue-software';
}

export function MYSQL_PASSWORD() {
    return '12345678';
}

export function DATETIME_FORMAT_MYSQL() {
    return 'YYYY-MM-DD HH:mm:ss';
}

export function SESSION_COOKIE_NAME() {
    return 'digital-queue-software';
}

export function SESSION_SECONDS_LIMIT() {
    // return 10; // 10 seconds
    return 60 * 60 * 2; // 2 hours
}




/*
    TODO (opcional): Pegar valor de uma possível configuração do cliente
*/

export function SERVER_TIMEZONE() {
    return 'America/Sao_Paulo';
}

export function SECRET_KEY() {
    return 'wksswszvdsmdgjl3';
}
