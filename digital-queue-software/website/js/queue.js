import 'regenerator-runtime';
import 'es6-promise/auto';
import 'fetch-polyfill';

import Queue from './modules/queue';



document.addEventListener('DOMContentLoaded', Queue.init);
