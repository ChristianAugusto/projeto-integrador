import El from './cache-selectors';



function show() {
    El.overlay.self.classList.add('is--visible');
}

function hide() {
    El.overlay.self.classList.remove('is--visible');
}



export default {
    show,
    hide,
    el: El.overlay.self
};
