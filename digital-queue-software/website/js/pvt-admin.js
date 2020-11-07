import 'regenerator-runtime';
import 'es6-promise/auto';
import 'fetch-polyfill';

import Admin from './modules/pvt/admin';



document.addEventListener('DOMContentLoaded', Admin.init);
