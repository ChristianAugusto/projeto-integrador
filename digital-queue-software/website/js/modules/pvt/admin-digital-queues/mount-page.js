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


/**
    * @param {HTMLElement} digitalQueueItem
*/
function openDigitalQueueItemPanel(digitalQueueItem) {
    digitalQueueItem.classList.add('panel-open');
}


/**
    * @param {HTMLElement} digitalQueueItem
*/
function closeDigitalQueueItemPanel(digitalQueueItem) {
    digitalQueueItem.classList.remove('panel-open');
}


function editDigitalQueue() {
    console.log('Editar fila');
}


function deleteDigitalQueue() {
    console.log('Deletar fila');
}


async function buildDigitalQueuesList() {
    const digitalQueues = await getDigitalQueues();

    digitalQueues.data.forEach(function(digitalQueue) {
        const digitalQueueItem = document.createElement('li');
        digitalQueueItem.classList.add('pvt-admin__digital-queues__item');

        const digitalQueueItemVisor = document.createElement('div');
        digitalQueueItemVisor.classList.add('pvt-admin__digital-queues__item-visor');
        digitalQueueItemVisor.innerHTML = `
            <p>${digitalQueue.name}</p>
            <a href="/admin/filas/${digitalQueue.id}">Link Privado</a>
            <a href="/filas/${digitalQueue.id}">Link Público</a>
        `;

        const openPanelButton = document.createElement('button');
        openPanelButton.setAttribute('type', 'button');
        openPanelButton.classList.add('reset');
        openPanelButton.classList.add('pvt-admin__digital-queues__item-open-panel-button');
        openPanelButton.onclick = openDigitalQueueItemPanel.bind(null, digitalQueueItem);
        openPanelButton.textContent = 'Abrir painel';

        const closePanelButton = document.createElement('button');
        closePanelButton.setAttribute('type', 'button');
        closePanelButton.classList.add('reset');
        closePanelButton.classList.add('pvt-admin__digital-queues__item-close-panel-button');
        closePanelButton.onclick = closeDigitalQueueItemPanel.bind(null, digitalQueueItem);
        closePanelButton.textContent = 'Fechar painel';

        const digitalQueueItemPanel = document.createElement('div');
        digitalQueueItemPanel.classList.add('pvt-admin__digital-queues__item-panel');

        const digitalQueueItemPanelActions = document.createElement('div');
        digitalQueueItemPanelActions.classList.add('pvt-admin__digital-queues__item-panel-actions');

        const editDigitalQueueButton = document.createElement('button');
        editDigitalQueueButton.setAttribute('type', 'button');
        editDigitalQueueButton.classList.add('reset');
        editDigitalQueueButton.classList.add('pvt-admin__digital-queues__item-edit-digital-queue-button');
        editDigitalQueueButton.onclick = editDigitalQueue;
        editDigitalQueueButton.textContent = 'Editar fila digital';

        const deleteDigitalQueueButton = document.createElement('button');
        deleteDigitalQueueButton.setAttribute('type', 'button');
        deleteDigitalQueueButton.classList.add('reset');
        deleteDigitalQueueButton.classList.add('pvt-admin__digital-queues__item-delete-digital-queue-button');
        deleteDigitalQueueButton.onclick = deleteDigitalQueue;
        deleteDigitalQueueButton.textContent = 'Deletar fila digital';

        digitalQueueItemPanelActions.appendChild(closePanelButton);
        digitalQueueItemPanelActions.appendChild(editDigitalQueueButton);
        digitalQueueItemPanelActions.appendChild(deleteDigitalQueueButton);

        digitalQueueItemPanel.appendChild(openPanelButton);
        digitalQueueItemPanel.appendChild(digitalQueueItemPanelActions);


        digitalQueueItem.appendChild(digitalQueueItemVisor);
        digitalQueueItem.appendChild(digitalQueueItemPanel);

        El.digitalQueuesList.appendChild(digitalQueueItem);
    });

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
