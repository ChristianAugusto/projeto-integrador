import 'regenerator-runtime';
import 'es6-promise/auto';
import 'fetch-polyfill';

import Login from './modules/pub/login';



document.addEventListener('DOMContentLoaded', Login.init);
