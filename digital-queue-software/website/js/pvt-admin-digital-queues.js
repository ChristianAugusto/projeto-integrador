import 'regenerator-runtime';
import 'es6-promise/auto';
import 'fetch-polyfill';

import AdminDigitalQueues from './modules/pvt/admin-digital-queues';



document.addEventListener('DOMContentLoaded', AdminDigitalQueues.init);
