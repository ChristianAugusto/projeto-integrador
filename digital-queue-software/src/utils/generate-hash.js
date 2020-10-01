import crypto from 'crypto';

import {
    SECRET_KEY
} from '@ServerConstants';



export default function(text) {
    const hash = crypto.createHmac('sha512', SECRET_KEY());
    hash.update(text);
    const value = hash.digest('hex');

    return value;
}
