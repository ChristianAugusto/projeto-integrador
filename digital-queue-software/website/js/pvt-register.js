import 'regenerator-runtime';
import 'es6-promise/auto';
import 'fetch-polyfill';

import Register from './modules/pvt/register';



document.addEventListener('DOMContentLoaded', Register.init);
