import Cookies from 'js-cookie';
import {
    SESSION_COOKIE_NAME, SESSION_SECONDS_LIMIT,
    SERVER_ERROR_MESSAGE, LOGIN_ROUTE, HOME_ROUTE
} from '@WebsiteConstants';
import { buildHeaders } from '@WebsiteUtils/api-call';



export default {
    init() {
        sendForm();
    }
};

function sendForm() {
    document.querySelector('.js--login-form').onsubmit = async function(ev) {
        ev.preventDefault();

        const response = await fetch(LOGIN_ROUTE, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                email: document.querySelector('#js--email').value,
                password: document.querySelector('#js--password').value
            })
        });

        const responseObj = await response.json();

        Cookies.set(SESSION_COOKIE_NAME, JSON.stringify(responseObj.data), { expires: getCookieTime() });

        if (response.status == 200) {
            window.location.pathname = HOME_ROUTE;
        }
        else {
            alert(SERVER_ERROR_MESSAGE);
        }
    };
}

function getCookieTime() {
    // return new Date(new Date().getTime() + ); // 10 seconds
    return new Date(new Date().getTime() + SESSION_SECONDS_LIMIT);
}
