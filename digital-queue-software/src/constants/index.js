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
