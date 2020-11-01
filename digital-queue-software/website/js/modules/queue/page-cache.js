import El from './cache-selectors';



const pageCache = {
    queue: {},
    queueUsers: []
};



export function loadCacheFromPage() {
    pageCache.queue.id = El.digitalQueueId.textContent.trim();
}

export function setQueueCache(obj) {
    const objKeyValues = Object.entries(obj);

    for (let i = 0; i < objKeyValues.length; i++) {
        const [key, value] = objKeyValues[i];

        pageCache.queue[key] = value;
    }
}

export function setQueueUsersCache(arr) {
    pageCache.queueUsers = arr;
}

export default pageCache;
