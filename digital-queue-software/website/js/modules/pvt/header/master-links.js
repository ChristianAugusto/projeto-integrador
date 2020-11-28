import Cookies from 'js-cookie';

import {
    SESSION_COOKIE_NAME
} from '@WebsiteConstants';



export default function() {
    const session = JSON.parse(Cookies.get(SESSION_COOKIE_NAME));


    if (session.roleType == 'master') {
        return false;
    }


    const masterLinks = document.querySelectorAll('.js--master-link');

    for (let i = 0; i < masterLinks.length; i++) {
        masterLinks[i].classList.add('is--hidden');
    }
}
