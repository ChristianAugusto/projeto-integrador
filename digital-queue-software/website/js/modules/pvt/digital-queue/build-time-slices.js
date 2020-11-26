import El from './cache-selectors';
import pageCache from './page-cache';
import pageLoader from '@WebsiteGlobal/page-loader';
import hourStringToMinutes from '@WebsiteUtils/hour-string-to-minutes';
import minutesToHourString from '@WebsiteUtils/minutes-to-hour-string';
import {
    ROUTES,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';
import {
    buildHeaders
} from '@WebsiteUtils/api-call';



/**
    * @param {Function} timeSliceClickCallback
*/
export default function(timeSliceClickCallback) {
    const { id, start, end, userTimeMinutes, users }
        = pageCache.digitalQueue;


    for (
        let curentTime = hourStringToMinutes(start), limit = hourStringToMinutes(end);
        curentTime < limit; curentTime += userTimeMinutes
    ) {
        const userInTime = users.filter(
            digitalQueueUser => hourStringToMinutes(digitalQueueUser.appointment) === curentTime
        );

        let userName = null;
        let userAttended  = null;

        if (userInTime.length > 0) {
            userName = userInTime[0].name;
            userAttended = userInTime[0].attended;
        }

        const timeStringValue = minutesToHourString(curentTime);

        const digitalQueueTimeSlice = document.createElement('li');


        let digitalQueueTimeSlicePanel = '';

        if (userInTime.length === 0) {
            digitalQueueTimeSlice.onclick = timeSliceClickCallback.bind(null, timeStringValue);
        }
        else {
            digitalQueueTimeSlice.onclick = openPanel.bind(null, digitalQueueTimeSlice);

            const attendUserState = userAttended ? 'checked="checked"' : '';

            digitalQueueTimeSlicePanel = `
                <div class="pvt-digital-queue__time-slice__panel">
                    <button type="button" class="pvt-digital-queue__time-slice__close-panel js--close-time-slice-panel">Fechar painel</button>
                    <button type="button" class="pvt-digital-queue__time-slice__attend-time-slice-user js--attend-time-slice-user" ${attendUserState}>Atender usuário</button>
                    <button type="button" class="pvt-digital-queue__time-slice__remove-time-slice-user js--remove-time-slice-user">Remover usuário</button>
                </div>
            `;
        }

        digitalQueueTimeSlice.setAttribute(
            'class',
            `pvt-digital-queue__time-slice${userAttended ? ' attended' : ''}`
        );
        digitalQueueTimeSlice.innerHTML = `
            <div class="pvt-digital-queue__time-slice__art">
                <p class="pvt-digital-queue__time-slice__user-name">${userName || ''}</p>
                ${digitalQueueTimeSlicePanel}
            </div>
            <div class="pvt-digital-queue__time-slice__label">
                <p class="pvt-digital-queue__time-slice__time">${timeStringValue}</p>
            </div>
        `;


        El.digitalQueue.timeSlices.appendChild(digitalQueueTimeSlice);


        const closeTimeSlicePanelButton = digitalQueueTimeSlice.querySelector('.js--close-time-slice-panel');
        const attendTimeSliceUserButton = digitalQueueTimeSlice.querySelector('.js--attend-time-slice-user');
        const removeTimeSliceUserButton = digitalQueueTimeSlice.querySelector('.js--remove-time-slice-user');

        if (userInTime.length > 0) {
            closeTimeSlicePanelButton.onclick = closePanel.bind(null, digitalQueueTimeSlice);
            attendTimeSliceUserButton.onclick = attendDigitalQueueUser.bind(
                attendTimeSliceUserButton, id, timeStringValue
            );
            removeTimeSliceUserButton.onclick = removeTimeSliceUser.bind(null, id, timeStringValue);
        }
    }
}


/**
    * @param {HTMLElement} digitalQueueTimeSlice
*/
function openPanel(digitalQueueTimeSlice) {
    digitalQueueTimeSlice.classList.add('panel-open');
}


/**
    * @param {HTMLElement} digitalQueueTimeSlice
    * @param {Event} event
*/
function closePanel(digitalQueueTimeSlice, event) {
    event.stopPropagation();

    digitalQueueTimeSlice.classList.remove('panel-open');
}


/**
    * @param {String} digitalQueueId
    * @param {String} timeStringValue
    * @param {Event} event
*/
async function removeTimeSliceUser(digitalQueueId, timeStringValue, event) {
    event.stopPropagation();

    try {
        const confirmUpdate = confirm(`Deseja remover o usuário do horário ${timeStringValue} ?`);

        if (!confirmUpdate) {
            return false;
        }

        pageLoader.show();

        const response = await fetch(ROUTES.api.pvt.digitalQueuesUsers, {
            method: 'DELETE',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                digitalQueueId,
                appointment: timeStringValue
            })
        });

        const responseObj = await response.json();

        if (responseObj.deleted) {
            alert(`Usuário removido com sucesso do horário ${timeStringValue}`);
            window.location.reload();
        }
        else {
            alert(SERVER_ERROR_MESSAGE);
        }

        return true;
    }
    catch (error) {
        console.error(error);
        alert(SERVER_ERROR_MESSAGE);
        return false;
    }
    finally {
        pageLoader.hide();
    }
}


/**
    * @param {String} digitalQueueId
    * @param {String} timeStringValue
    * @param {Event} event
*/
async function attendDigitalQueueUser(digitalQueueId, timeStringValue, event) {
    event.stopPropagation();

    try {
        const attended = this.getAttribute('checked') ? true : false;
        const confirmUpdate = confirm(`Deseja atualizar o status de atendimento do usuário do horário ${timeStringValue} ?`);

        if (!confirmUpdate) {
            return false;
        }

        pageLoader.show();

        const response = await fetch(ROUTES.api.pvt.digitalQueuesUsersAttend, {
            method: 'PATCH',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                digitalQueueId,
                appointment: timeStringValue,
                attended: !attended
            })
        });

        const responseObj = await response.json();

        if (responseObj.updated) {
            alert('Status de atendimento atualizado com sucesso');
            window.location.reload();
        }
        else {
            alert(SERVER_ERROR_MESSAGE);
        }

        return true;
    }
    catch (error) {
        console.error(error);
        alert(SERVER_ERROR_MESSAGE);
        return false;
    }
    finally {
        pageLoader.hide();
    }
}
