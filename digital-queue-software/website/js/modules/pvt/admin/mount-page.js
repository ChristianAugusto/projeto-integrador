import El from './cache-selectors';
import getHashParam from '@WebsiteUtils/get-hash-param';
import {
    DIGITAL_QUEUE_LIMIT,
    SERVER_ERROR_MESSAGE,
    ROUTES
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';
import pageLoader from '@WebsiteGlobal/page-loader';



const controller = {};


async function getDigitalQueues() {
    try {
        const response = await fetch(ROUTES.api.pvt.digitalQueues, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                startIndex: (controller.page - 1) * DIGITAL_QUEUE_LIMIT
            })
        });

        const responseObj = await response.json();

        return responseObj;
    }
    catch (error) {
        console.error(error);
    }

    alert(SERVER_ERROR_MESSAGE);
    return [];
}

async function buildDigitalQueuesList() {
    const digitalQueues = await getDigitalQueues();

    El.digitalQueuesList.innerHTML = digitalQueues.data.reduce(function(acc, digitalQueue) {
        return acc + `
            <li class="pvt-admin__queues__item">
                <p>${digitalQueue.name}</p>
                <a href="/admin/filas/${digitalQueue.id}">Link Privado</a>
                <a href="/filas/${digitalQueue.id}">Link Público</a>
            </li>
        `;
    }, '');

    El.pageDisplay.innerHTML = controller.page;

    controller.totalPages = parseInt(Number(digitalQueues.results) / DIGITAL_QUEUE_LIMIT) 
        + (Number(digitalQueues.results) % DIGITAL_QUEUE_LIMIT > 0 ? 1 : 0);

    if (Number(controller.page) === 1) {
        El.previusPage.classList.add('is-blurred');
    }
    else {
        El.previusPage.classList.remove('is-blurred');
    }

    if (Number(controller.page) === controller.totalPages) {
        El.nextPage.classList.add('is-blurred');
    }
    else {
        El.nextPage.classList.remove('is-blurred');
    }

    window.location.hash = `#?page=${controller.page}`;
}

function setEvents() {
    El.nextPage.onclick = function() {
        controller.page++;
        buildDigitalQueuesList();
    };

    El.previusPage.onclick = function() {
        if (controller.page != 1) {
            controller.page--;
        }
        buildDigitalQueuesList();
    };
}



export default async function() {
    controller.page = getHashParam('page') || 1;
    await buildDigitalQueuesList();
    setEvents();
    pageLoader.hide();
}
