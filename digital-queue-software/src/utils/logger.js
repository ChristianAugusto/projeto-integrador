function info(message) {
    console.log(`INFO    - ${message}`);
}


function warning(message) {
    console.log(`WARNING - ${message}`);
}


function error(message) {
    console.log(`ERROR   - ${message}`);
}


export default {
    info,
    warning,
    error
};
