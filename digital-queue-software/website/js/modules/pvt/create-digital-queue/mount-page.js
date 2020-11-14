import moment from 'moment-timezone';
import IMask from 'imask';

import El from './cache-selectors';
import {
    SERVER_TIMEZONE,
    INPUT_DATE_MASK,
    TRANSPORTS_LIMIT,
    ROUTES,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';
import pageLoader from '@WebsiteGlobal/page-loader';
import sendForm from './send-form';



function dayMinValue() {
    const dateNow = moment().tz(SERVER_TIMEZONE()).format(INPUT_DATE_MASK);

    El.form.digitalQueueDay.setAttribute('min', dateNow);
}


function masks() {
    IMask(
        El.form.digitalQueueStart, {
            mask: '00:00'
        });

    IMask(
        El.form.digitalQueueEnd, {
            mask: '00:00'
        });
}


function setEvents() {
    El.form.digitalQueueName.onkeyup = function() {
        const newValue = El.form.digitalQueueName.value.replace(/[^a-zA-Z 0-9_-]/gm, '');

        El.form.digitalQueueName.value = newValue;

        const valueFormatted = newValue.trim().toLowerCase().replace(/[ _]/gmi, '-').replace();

        El.form.digitalQueueId.value = valueFormatted;

        El.form.digitalQueueId.classList.remove('in-use');
    };

    El.form.digitalQueueId.onkeyup = function() {
        El.form.digitalQueueId.classList.remove('in-use');
    };

    El.form.digitalQueueUserTimeMinutes.onchange = function() {
        const curentValue = El.form.digitalQueueUserTimeMinutes.value.trim();

        if (Number(curentValue) < 1) {
            El.form.digitalQueueUserTimeMinutes.value = 1;
        }
    };

    El.form.self.onsubmit = sendForm;
}


async function getTransports(page) {
    try {
        const response = await fetch(ROUTES.api.pvt.transports, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                startIndex: (page - 1) * TRANSPORTS_LIMIT
            })
        });

        const responseObj = await response.json();

        return responseObj;
    }
    catch (error) {
        console.error(error);
    }

    alert(SERVER_ERROR_MESSAGE);
    return {
        results: 0,
        data: []
    };
}


async function buildTransportsOptions() {
    let totalPages = 1;

    for (let page = 1; page <= totalPages; page++) {
        const getTransportsResponse = await getTransports(page);

        const transports = getTransportsResponse.data;

        for (let i = 0; i < transports.length; i++) {
            const id = `transport-checkbox-${transports[i].id}`;

            El.form.digitalQueueTransportsList.innerHTML += `
                <li>
                    <label for="${id}">${transports[i].name}</label>
                    <input type="checkbox" value="${transports[i].id}" id="${id}" class="reset" />
                </li>
            `;
        }

        totalPages = parseInt(Number(getTransportsResponse.results) / TRANSPORTS_LIMIT) 
            + (Number(getTransportsResponse.results) % TRANSPORTS_LIMIT > 0 ? 1 : 0);
    }
}



export default async function () {
    dayMinValue();
    masks();
    setEvents();
    await buildTransportsOptions();
    pageLoader.hide();
}
