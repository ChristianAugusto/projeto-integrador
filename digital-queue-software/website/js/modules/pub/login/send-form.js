import Cookies from 'js-cookie';

import El from './cache-selectors';
import { buildHeaders } from '@WebsiteUtils/api-call';
import {
    SESSION_COOKIE_NAME, SESSION_SECONDS_LIMIT,
    SERVER_ERROR_MESSAGE, ROUTES
} from '@WebsiteConstants';



function getCookieTime() {
    return new Date(new Date().getTime() + SESSION_SECONDS_LIMIT);
}



export default async function(event) {
    event.preventDefault();

    try {
        const response = await fetch(ROUTES.api.pub.login, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                email: El.form.userEmail.value.trim(),
                password: El.form.userPassword.value.trim()
            })
        });

        const responseObj = await response.json();

        Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(responseObj.data), { expires: getCookieTime() });

        window.location.pathname = ROUTES.pages.pvt.admin;
    }
    catch (error) {
        alert(SERVER_ERROR_MESSAGE);
    }
}
