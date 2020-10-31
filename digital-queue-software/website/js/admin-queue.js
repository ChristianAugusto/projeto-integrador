import 'regenerator-runtime';
import 'es6-promise/auto';
import 'fetch-polyfill';

import AdminQueue from './modules/admin-queue';



document.addEventListener('DOMContentLoaded', AdminQueue.init());
