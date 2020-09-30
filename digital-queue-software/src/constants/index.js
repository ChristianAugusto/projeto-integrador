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
    return 'localhost';
}

export function MYSQL_PORT() {
    return 3306;
}

export function MYSQL_USER() {
    return 'root';
}

export function MYSQL_PASSWORD() {
    return '12345678';
}

export function MYSQL_DATABASE() {
    return 'digital-queue-software';
}

export function SERVER_TIMEZONE() {
    return 'America/Sao_Paulo';
}

export function DATETIME_FORMAT_MYSQL() {
    return 'YYYY-MM-DD HH:mm:ss';
}
