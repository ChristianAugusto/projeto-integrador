import El from './cache-selectors';



const pageCache = {
    digitalQueue: {},
    form: {}
};



export function loadCacheFromPage() {
    pageCache.digitalQueue.id = El.digitalQueue.id.textContent.trim();
}

export function setQueueCache(obj) {
    const objKeyValues = Object.entries(obj);

    for (let i = 0; i < objKeyValues.length; i++) {
        const [key, value] = objKeyValues[i];

        pageCache.digitalQueue[key] = value;
    }
}

export default pageCache;
