import El from './cache-selectors';



function blockScroll() {
    El.page.classList.add('is--scroll-blocked');
}

function unblockScroll() {
    El.page.classList.remove('is--scroll-blocked');
}


export default {
    blockScroll,
    unblockScroll
};
