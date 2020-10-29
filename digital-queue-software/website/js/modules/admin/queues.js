import El from './cache-selectors';
import getHashParam from '@WebsiteUtils/get-hash-param';
import {
    DIGITAL_QUEUE_LIMIT,
    DIGITAL_QUEUES_API,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';



const controller = {};


async function getDigitalQueues() {
    const response = await fetch(DIGITAL_QUEUES_API, {
        method: 'POST',
        headers: buildHeaders({
            'Content-Type': 'application/json'
        }),
        body: JSON.stringify({
            startIndex: (controller.page - 1) * DIGITAL_QUEUE_LIMIT
        })
    });

    const responseObj = await response.json();

    if (response.status == 200) {
        return responseObj;
    }
    else {
        alert(SERVER_ERROR_MESSAGE);
        return [];
    }
}

async function mountPage() {
    const digitalQueues = await getDigitalQueues();

    El.queuesList.innerHTML = digitalQueues.data.reduce(function(acc, digitalQueue) {
        return acc + `
            <li>
                <a href="/filas/${digitalQueue.id}">${digitalQueue.name}</a>
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
        mountPage();
    };

    El.previusPage.onclick = function() {
        if (controller.page != 1) {
            controller.page--;
        }
        mountPage();
    };
}



export default {
    init() {
        controller.page = getHashParam('page') || 1;
        mountPage();
        setEvents();
    }
};