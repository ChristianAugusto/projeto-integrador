import El from './cache-selectors';
import {
    ROUTES,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';



export default async function(event) {    
    try {
        event.preventDefault();


        const userTimeMinutes = Number(El.form.digitalQueueUserTimeMinutes.value.trim());

        if (userTimeMinutes < 1) {
            alert('O tempo de atendimento precisa ser no mínimo 1!!');
            return false;
        }


        const transportsItems = El.form.digitalQueueTransportsList.querySelectorAll('input:checked');
        const transportsIds = [];

        for (let i = 0; i < transportsItems.length; i++) {
            transportsIds.push(Number(transportsItems[i].value));
        }

        if (transportsIds.length === 0) {
            alert('Escolha pelo menos 1 opção de transporte permitido');
            return false;
        }

        const digitalQueueId = El.form.digitalQueueId.value.trim();

        const getDigitalQueueResponse = await fetch(ROUTES.api.pvt.digitalQueues, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                id: digitalQueueId
            })
        });

        const getDigitalQueueResponseObj = await getDigitalQueueResponse.json();

        if (getDigitalQueueResponseObj.data.length > 0) {
            El.form.digitalQueueId.classList.add('in-use');
            alert('O id da fila digital já está sendo utilizado');
            return false;
        }


        const data = {
            id: digitalQueueId,
            name: El.form.digitalQueueName.value.trim(),
            isActive: El.form.digitalQueueIsActive.checked ? 1 : 0,
            day: El.form.digitalQueueDay.value,
            start: El.form.digitalQueueStart.value.trim(),
            end: El.form.digitalQueueEnd.value.trim(),
            userTimeMinutes: userTimeMinutes,
            transportsIds
        };

        const sendFormResponse = await fetch(ROUTES.api.pvt.digitalQueues, {
            method: 'PUT',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });

        const sendFormResponseObj = await sendFormResponse.json();

        if (sendFormResponseObj.created) {
            alert('Sucesso');
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
}
