import pageCache, { setQueueCache, setQueueUsersCache } from './page-cache';
import {
    DIGITAL_QUEUES_API,
    DIGITAL_QUEUES_USERS_API,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';




async function getQueue() {
    try {
        const response = await fetch(DIGITAL_QUEUES_API, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                id: pageCache.queue.id
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

async function getQueueUsers() {
    try {
        const response = await fetch(DIGITAL_QUEUES_USERS_API, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                digitalQueueId: pageCache.queue.id
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

export default async function() {
    const queueResponse = await getQueue();

    const queue = queueResponse.data[0];

    const queueUsersResponse = await getQueueUsers();

    const queueUsers = queueUsersResponse.data;

    setQueueCache(queue);
    setQueueUsersCache(queueUsers);
}
