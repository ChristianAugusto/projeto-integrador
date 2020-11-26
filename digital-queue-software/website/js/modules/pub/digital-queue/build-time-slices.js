import El from './cache-selectors';
import pageCache from './page-cache';
import hourStringToMinutes from '@WebsiteUtils/hour-string-to-minutes';
import minutesToHourString from '@WebsiteUtils/minutes-to-hour-string';



/**
    * @param {Function} timeSliceClickCallback
*/
export default function(timeSliceClickCallback) {
    const { start, end, userTimeMinutes, users }
        = pageCache.digitalQueue;


    for (
        let curentTime = hourStringToMinutes(start), limit = hourStringToMinutes(end);
        curentTime < limit; curentTime += userTimeMinutes
    ) {
        const userInTime = users.filter(
            digitalQueueUser => hourStringToMinutes(digitalQueueUser.appointment) === curentTime
        );

        let userName = null;
        let userAttended  = null;

        if (userInTime.length > 0) {
            userName = userInTime[0].name;
            userAttended = userInTime[0].attended;
        }

        const timeStringValue = minutesToHourString(curentTime);

        const digitalQueueTimeSlice = document.createElement('li');


        let digitalQueueTimeSlicePanel = '';

        if (userInTime.length === 0) {
            digitalQueueTimeSlice.onclick = timeSliceClickCallback.bind(null, timeStringValue);
        }

        digitalQueueTimeSlice.setAttribute(
            'class',
            `pub-digital-queue__time-slice${userInTime.length === 0 ? '' : ' unavailable'}${userAttended ? ' attended' : ''}`
        );
        digitalQueueTimeSlice.innerHTML = `
            <div class="pub-digital-queue__time-slice__art">
                <p class="pub-digital-queue__time-slice__user-name">${userName || ''}</p>
                ${digitalQueueTimeSlicePanel}
            </div>
            <div class="pub-digital-queue__time-slice__label">
                <p class="pub-digital-queue__time-slice__time">${timeStringValue}</p>
            </div>
        `;


        El.digitalQueue.timeSlices.appendChild(digitalQueueTimeSlice);
    }
}
