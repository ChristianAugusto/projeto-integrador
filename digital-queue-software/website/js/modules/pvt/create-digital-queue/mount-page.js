import moment from 'moment-timezone';
import IMask from 'imask';

import El from './cache-selectors';
import {
    SERVER_TIMEZONE,
    INPUT_DATE_MASK
} from '@WebsiteConstants';



function dayMinValue() {
    const dateNow = moment().tz(SERVER_TIMEZONE()).format(INPUT_DATE_MASK);

    El.form.day.setAttribute('min', dateNow);
}

function masks() {
    IMask(
        El.form.start, {
            mask: '00:00'
        });

    IMask(
        El.form.end, {
            mask: '00:00'
        });
}


export default async function () {
    dayMinValue();
    masks();
}
