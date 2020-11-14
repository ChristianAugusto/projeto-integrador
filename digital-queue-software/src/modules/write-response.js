export default function(_respObj, res) {
    if (_respObj.status) {
        res.status(_respObj.status);
    }
    else {
        res.status(500);
    }

    if (_respObj.headers) {
        Object.entries(_respObj.headers).forEach(([name, value]) => res.setHeader(name, value));
    }
    else {
        res.setHeader('Content-Type', 'text/plain');
    }

    if (_respObj.body && typeof(_respObj.body) === 'string') {
        res.send(_respObj.body);
    }
    else {
        res.send('');
    }

    res.end();
}
