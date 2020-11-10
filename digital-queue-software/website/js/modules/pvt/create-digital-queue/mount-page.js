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

            El.form.transportsList.innerHTML += `
                <li>
                    <label for="${id}">${transports[i].name}</label>
                    <input type="checkbox" value="${transports[i].name}" id="${id}" class="reset" />
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
    await buildTransportsOptions();
    pageLoader.hide();
}
