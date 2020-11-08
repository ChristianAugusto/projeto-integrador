import 'regenerator-runtime';
import 'es6-promise/auto';
import 'fetch-polyfill';

import DigitalQueue from './modules/pub/digital-queue';



document.addEventListener('DOMContentLoaded', DigitalQueue.init);
