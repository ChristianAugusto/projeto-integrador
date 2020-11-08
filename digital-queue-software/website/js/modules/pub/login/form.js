import Cookies from 'js-cookie';
import {
    SESSION_COOKIE_NAME, SESSION_SECONDS_LIMIT,
    SERVER_ERROR_MESSAGE, ROUTES
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';



function setSendForm() {
    document.querySelector('.js--login-form').onsubmit = async function(ev) {
        ev.preventDefault();


        try {
            const response = await fetch(ROUTES.api.pub.login, {
                method: 'POST',
                headers: buildHeaders({
                    'Content-Type': 'application/json'
                }),
                body: JSON.stringify({
                    email: document.querySelector('#js--email').value.trim(),
                    password: document.querySelector('#js--password').value.trim()
                })
            });

            const responseObj = await response.json();

            Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(responseObj.data), { expires: getCookieTime() });

            window.location.pathname = ROUTES.pages.pvt.admin;
        }
        catch (error) {
            alert(SERVER_ERROR_MESSAGE);
        }
    };
}

function getCookieTime() {
    // return new Date(new Date().getTime() + ); // 10 seconds
    return new Date(new Date().getTime() + SESSION_SECONDS_LIMIT);
}



export default {
    init() {
        setSendForm();
    }
};