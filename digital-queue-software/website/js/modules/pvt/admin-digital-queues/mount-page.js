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


async function deleteDigitalQueue(digitalQueueId) {
    try {
        const confirmDelete = confirm(`Deseja deletar a fila ${digitalQueueId} ?`);

        if (!confirmDelete) {
            return false;
        }

        pageLoader.show();

        const sendFormResponse = await fetch(ROUTES.api.pvt.digitalQueues, {
            method: 'DELETE',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                id: digitalQueueId
            })
        });

        const sendFormResponseObj = await sendFormResponse.json();

        if (sendFormResponseObj.deleted) {
            alert(`Fila digital (${digitalQueueId}) foi deletada com sucesso`);
            window.location.reload();
        }
        else {
            alert(SERVER_ERROR_MESSAGE);
        }

        return true;
    }
    catch (error) {
        alert(SERVER_ERROR_MESSAGE);
        return false;
    }
    finally {
        pageLoader.hide();
    }
}

async function bindActiveDigitalQueue(digitalQueueId) {
    try {
        const isActive = this.getAttribute('checked') ? true : false;


        const confirmUpdate = confirm(`Deseja ${isActive ? 'desativar' : 'ativar'} a fila ${digitalQueueId} ?`);

        if (!confirmUpdate) {
            return false;
        }


        pageLoader.show();

        const sendFormResponse = await fetch(ROUTES.api.pvt.digitalQueues, {
            method: 'PATCH',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                id: digitalQueueId,
                isActive: !isActive
            })
        });

        const sendFormResponseObj = await sendFormResponse.json();

        if (sendFormResponseObj.updated) {
            alert(`Fila digital (${digitalQueueId}) foi atualizada`);
            window.location.reload();
        }
        else {
            alert(SERVER_ERROR_MESSAGE);
        }

        return true;
    }
    catch (error) {
        alert(SERVER_ERROR_MESSAGE);
        return false;
    }
    finally {
        pageLoader.hide();
    }
}


async function buildDigitalQueuesList() {
    const digitalQueues = await getDigitalQueues();

    digitalQueues.data.forEach(function(digitalQueue, index) {
        const digitalQueueItem = document.createElement('li');
        digitalQueueItem.classList.add('pvt-admin-digital-queues__item');

        const digitalQueueItemVisor = document.createElement('div');
        digitalQueueItemVisor.classList.add('pvt-admin-digital-queues__item-visor');
        digitalQueueItemVisor.innerHTML = `
            <p>${digitalQueue.name}</p>
            <a href="/admin/filas/${digitalQueue.id}">Link Privado</a>
            <a href="/filas/${digitalQueue.id}">Link Público</a>
        `;

        const openPanelButton = document.createElement('button');
        openPanelButton.setAttribute('type', 'button');
        openPanelButton.classList.add('reset');
        openPanelButton.classList.add('pvt-admin-digital-queues__item-open-panel-button');
        openPanelButton.onclick = openDigitalQueueItemPanel.bind(null, digitalQueueItem);
        openPanelButton.textContent = 'Abrir painel';

        const closePanelButton = document.createElement('button');
        closePanelButton.setAttribute('type', 'button');
        closePanelButton.classList.add('reset');
        closePanelButton.classList.add('pvt-admin-digital-queues__item-close-panel-button');
        closePanelButton.onclick = closeDigitalQueueItemPanel.bind(null, digitalQueueItem);
        closePanelButton.textContent = 'Fechar painel';

        const deleteDigitalQueueButton = document.createElement('button');
        deleteDigitalQueueButton.setAttribute('type', 'button');
        deleteDigitalQueueButton.classList.add('reset');
        deleteDigitalQueueButton.classList.add('pvt-admin-digital-queues__item-delete-button');
        deleteDigitalQueueButton.onclick = deleteDigitalQueue.bind(null, digitalQueue.id);
        deleteDigitalQueueButton.textContent = 'Deletar fila digital';


        const activeDigitalQueue = document.createElement('button');
        activeDigitalQueue.setAttribute('type', 'button');
        activeDigitalQueue.classList.add('reset');
        activeDigitalQueue.classList.add('pvt-admin-digital-queues__item-active');
        activeDigitalQueue.setAttribute('id', `js--active-digital-queue-${index}`);
        if (digitalQueue.isActive) {
            activeDigitalQueue.setAttribute('checked', 'checked');
        }
        activeDigitalQueue.onclick = bindActiveDigitalQueue.bind(activeDigitalQueue, digitalQueue.id);

        const activeDigitalQueueWrapper = document.createElement('div');
        activeDigitalQueueWrapper.classList.add('pvt-admin-digital-queues__item-active-wrapper');
        activeDigitalQueueWrapper.innerHTML = `
            <label for="js--active-digital-queue-${index}">
                Ativar/Desativar fila digital
            </label>
        `;
        activeDigitalQueueWrapper.appendChild(activeDigitalQueue);


        const digitalQueueItemPanel = document.createElement('div');
        digitalQueueItemPanel.classList.add('pvt-admin-digital-queues__item-panel');

        const digitalQueueItemPanelActions = document.createElement('div');
        digitalQueueItemPanelActions.classList.add('pvt-admin-digital-queues__item-panel-actions');

        digitalQueueItemPanelActions.appendChild(closePanelButton);
        digitalQueueItemPanelActions.appendChild(activeDigitalQueueWrapper);
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
