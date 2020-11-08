import 'regenerator-runtime';
import 'es6-promise/auto';
import 'fetch-polyfill';

import CreateDigitalQueue from './modules/pvt/create-digital-queue';



document.addEventListener('DOMContentLoaded', CreateDigitalQueue.init());
