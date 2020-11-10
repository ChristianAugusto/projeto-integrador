import El from './cache-selectors';



function show() {
    El.pageLoader.classList.add('is--visible');
}

function hide() {
    El.pageLoader.classList.remove('is--visible');
}



export default {
    show,
    hide,
    el: El.pageLoader.self
};
