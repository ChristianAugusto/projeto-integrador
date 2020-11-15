import 'regenerator-runtime';
import 'es6-promise/auto';
import 'fetch-polyfill';

import RegisterUser from './modules/pvt/register-user';



document.addEventListener('DOMContentLoaded', RegisterUser.init);
