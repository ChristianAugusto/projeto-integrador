import pageCache,
{
    setQueueCache
} from './page-cache';
import {
    ROUTES,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';



async function getDigitalQueueData() {
    try {
        const response = await fetch(ROUTES.api.pub.digitalQueuePage, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                digitalQueueId: pageCache.digitalQueue.id
            })
        });

        const responseObj = await response.json();

        return responseObj.data;
    }
    catch (error) {
        console.error(error);
        alert(SERVER_ERROR_MESSAGE);
        return {};
    }
}

export default async function() {
    const getDigitalQueueDataResponse = await getDigitalQueueData();

    setQueueCache(getDigitalQueueDataResponse);
}
