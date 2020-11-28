import Cookies from 'js-cookie';

import El from './cache-selectors';
import page from '@WebsiteGlobal/page';
import { buildHeaders } from '@WebsiteUtils/api-call';
import {
    ROUTES, SERVER_ERROR_MESSAGE,
    SESSION_COOKIE_NAME
} from '@WebsiteConstants';



export default function() {
    El.openMenu.onclick = function() {
        El.navigationMenu.classList.add('is--open');
        page.blockScroll();
    };


    El.closeMenu.onclick = function() {
        page.unblockScroll();
        El.navigationMenu.classList.remove('is--open');
    };


    El.logout.onclick = async function() {
        try {
            await fetch(ROUTES.api.pvt.logout, {
                method: 'POST',
                headers: buildHeaders({
                    'Content-Type': 'application/json'
                })
            });

            Cookies.remove(SESSION_COOKIE_NAME);
            window.location.pathname = ROUTES.pages.pub.login;
        }
        catch (error) {
            alert(SERVER_ERROR_MESSAGE);
        }
    };
}
