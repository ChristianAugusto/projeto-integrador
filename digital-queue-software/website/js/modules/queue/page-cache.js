import El from './cache-selectors';



const pageCache = {
    queue: {}
};



export function loadCache() {
    pageCache.queue.id = El.digitalQueueId.textContent.trim();
}

export default pageCache;
