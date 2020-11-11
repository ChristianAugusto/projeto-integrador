import El from './cache-selectors';



function show() {
    El.overlay.classList.add('is--visible');
}

function hide() {
    El.overlay.classList.remove('is--visible');
}



export default {
    show,
    hide,
    el: El.overlay
};
