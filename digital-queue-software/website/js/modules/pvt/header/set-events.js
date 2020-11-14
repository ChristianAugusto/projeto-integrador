import El from './cache-selectors';
import page from '@WebsiteGlobal/page';



export default function() {
    El.openMenu.onclick = function() {
        El.navigationMenu.classList.add('is--open');
        page.blockScroll();
    };


    El.closeMenu.onclick = function() {
        page.unblockScroll();
        El.navigationMenu.classList.remove('is--open');
    };


    El.logout.onclick = function() {
        /*
            TODO: Logout
        */
    };
}
