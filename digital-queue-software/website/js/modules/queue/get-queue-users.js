import El from './cache-selectors';
import {
    DIGITAL_QUEUES_USERS_API,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';



export default async function() {
    try {
        const response = await fetch(DIGITAL_QUEUES_USERS_API, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                digitalQueueId: El.digitalQueueId.textContent.trim()
            })
        });

        const responseObj = await response.json();

        return responseObj;
    }
    catch (error) {
        console.error(error);
        alert(SERVER_ERROR_MESSAGE);
        return null;
    }
}
