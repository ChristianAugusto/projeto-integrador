import El from './cache-selectors';
import {
    ROUTES,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';



export default async function(event) {    
    try {
        event.preventDefault();

        const transportsItems = El.form.digitalQueueTransportsList.querySelectorAll('input:checked');
        const transportsIds = [];

        for (let i = 0; i < transportsItems.length; i++) {
            transportsIds.push(Number(transportsItems[i].value));
        }

        if (transportsIds.length === 0) {
            alert('Escolha pelo menos 1 opção de transporte permitido');
            return false;
        }

        const data = {
            id: El.form.digitalQueueId.value.trim(),
            name: El.form.digitalQueueName.value.trim(),
            isActive: El.form.digitalQueueIsActive.checked ? 1 : 0,
            day: El.form.digitalQueueDay.value,
            start: El.form.digitalQueueStart.value.trim(),
            end: El.form.digitalQueueEnd.value.trim(),
            userTimeMinutes: El.form.digitalQueueUserTimeMinutes.value.trim(),
            transportsIds
        };

        const response = await fetch(ROUTES.api.pvt.digitalQueues, {
            method: 'PUT',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(data)
        });

        const responseObj = await response.json();

        if (responseObj.created) {
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
