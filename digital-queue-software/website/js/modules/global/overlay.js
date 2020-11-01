import El from './cache-selectors';



function showOverlay() {
    El.overlay.self.classList.add('is--visible');
}

function hideOverlay() {
    El.overlay.self.classList.remove('is--visible');
}



export default {
    showOverlay,
    hideOverlay,
    el: El.overlay.self
};
